import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CircularProgress,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { CartResponse, CheckoutItem } from '../components/checkout';
import { useCart, useProducts } from '../fetch/product';
  
  export type TransactionItem = {
    id: number;
    title: string;
    price: number;
    amountOrdered: number;
  };
  
  export type Transaction = {
    transactionId: string;
    transactionItems: TransactionItem[];
  };

  function TransactionItem({ transactionItem }: { transactionItem: TransactionItem }) {
    return (
      <Card sx={{ 
          width: '100%', 
          borderBottom: 1, 
          borderTop: 0, 
          borderRight: 0, 
          borderLeft: 0, 
          borderRadius: 0, 
          borderStyle: 'dashed', 
          boxShadow: 0 
      }}>
        <Box display={'flex'} flexDirection={'column'}>
          <Typography overflow={'ellipsis'} variant="body1" p={1}>
            {transactionItem.title}
          </Typography>
          <Typography overflow={'ellipsis'} variant="body2" p={1}>
            Amount Ordered: {transactionItem.amountOrdered} Price: ${(transactionItem.price * transactionItem.amountOrdered).toFixed(2)}
          </Typography>
        </Box>
      </Card>
    );
  }
  
  function Transaction({ transaction }: { transaction: Transaction }) {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5">
            Transaction #{transaction.transactionId}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography variant="h6" p={1}>
              Receipt
            </Typography>
            {transaction.transactionItems.map((item, index) => (
              <TransactionItem key={index} transactionItem={item} />
            ))}
            <Typography variant="body1" p={1}>
              Total Price: $
              {transaction.transactionItems
                .reduce((total, product) => total + product.price * product.amountOrdered, 0)
                .toFixed(2)}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }
  
  export default function Transactions() {
    const { getCart } = useCart();
    const { getProductById } = useProducts();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [failedRequest, setFailedRequest] = useState<boolean>(false);

    useEffect(() => {
      async function load() {
        const res = await getCart();
        if (res.success) {
          const cart = res.json as CartResponse;
          const transactionList: Transaction[] = [];
          const transIdSet = new Set<string>();

          //Grabs all the user's cart items
          const transactionPromises = cart.cartItems
            .filter((item) => item.itemStatus === "Purchased")
            .map(async (cartItem) => {
              const response = await getProductById(cartItem.ProductId);
              const product = response.json as CheckoutItem;
              const newTransactionItem: TransactionItem = {
                id: product.ProductId,
                title: product.title,
                price: product.price,
                amountOrdered: cartItem.quantity
              };
              const newItemId = cartItem.transactionId;

              //Check if this transaction has been initialized already
              if(transIdSet.has(newItemId)) {
                const transaction = transactionList.find((current) => current.transactionId === newItemId);
                if (transaction) {
                  transaction.transactionItems.push(newTransactionItem);
                }
              } else {
                transIdSet.add(newItemId);
                const newTransaction: Transaction = {
                  transactionId: newItemId, 
                  transactionItems: [newTransactionItem]};
                transactionList.push(newTransaction)
              }
            });

          await Promise.all(transactionPromises);
          setTransactions(transactionList);

        } else {
          setFailedRequest(true);
        }
      }
      load();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    return (
<Stack direction={'column'} alignItems={'center'} justifyContent={'center'} spacing={2}>
      <Typography variant="h1" textAlign={'center'}>
        Transaction History
      </Typography>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ width: '100%' }}
      >
        <Paper sx={{ elevation: 0, padding: 2, minWidth: '300px', width: 'fit-content', margin: 'auto' }}>
          {transactions.length === 0 && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100px">
              <CircularProgress size={40} />
            </Box>
          )}
          {failedRequest && (
            <Typography variant='h3'>Failed to reach server. Make sure terraform is running!</Typography>
          )}
          <Stack spacing={2}>
            {transactions.map((transaction, i) => (
              <Transaction key={i} transaction={transaction} />
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Stack>
    );
  }
  