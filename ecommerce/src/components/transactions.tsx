import {
    Box,
    Card,
    CircularProgress,
    Stack,
    Typography,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import { useCart, useProducts } from '../fetch/product';
  import { CartResponse, CheckoutItem } from '../components/checkout';
  
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
      <>
        <Card sx={{ 
            width: '100%', 
            borderBottom: 1, 
            borderTop: 0, 
            borderRight: 0, 
            borderLeft: 0, 
            borderborderRadius: 0, 
            borderStyle: 'dashed', 
            boxShadow:0}}>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography overflow={'ellipsis'} variant="body1" p={1}>
              {transactionItem.title}
            </Typography>
            <Typography overflow={'ellipsis'} variant="body2" p={1}>
              Amount Ordered: {transactionItem.amountOrdered} Price: ${(transactionItem.price * transactionItem.amountOrdered).toFixed(2)}
            </Typography>
          </Box>
        </Card>
      </>
    );
  }

  function Transaction({ transaction }: { transaction: Transaction}) {
  
    return (
      <>
        <Card sx={{ width: '100%', border: 1, borderRadius: 0,}}>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography overflow={'ellipsis'} variant="h5" p={1} pb={.2}>
              Transaction #{transaction.transactionId}
            </Typography>
            <Typography overflow={'ellipsis'} variant="body1" p={1}>
              Total Price: $
              {transaction.transactionItems
                .map((product) => product.price * product.amountOrdered) 
                .reduce((total, price) => total+price, 0).toFixed(2)
              }
            </Typography>
          </Box>
        </Card>
        {transaction.transactionItems.length === 0 && (
            <CircularProgress size={40} sx={{ mx: 'auto', my: 'auto' }} />
            )}
            <Box
                flexDirection={'column'}
                gap={1}
                justifyContent={'center'}
                sx={{mt: 0, border: 1, width: '90%', borderLeft: 1, borderRight: 1, ml: 3}}
            >
                {transaction.transactionItems.map((product, i) => (
                    <TransactionItem key={i} transactionItem={product} />
                ))}
            </Box>
      </>
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
      <Stack direction={'column'}>
        <Typography variant="h1" textAlign={'center'}>
          Transaction History
        </Typography>
        <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 1,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"main main main . ."`,
        }}> 
        {transactions.length === 0 && (
                <CircularProgress size={40} sx={{ mx: 'auto', my: 'auto' }} />
                )}
          {failedRequest && (
            <Typography variant='h3'>Failed to reach server. Make sure terraform is running!</Typography>)
          }
          <Box sx={{ gridArea: 'main', elevation: 0}}>
            {transactions.map((transaction, i) => (
              <Transaction key={i} transaction={transaction} />
            ))}
          </Box>
        </Box>
      </Stack>
    );
  }
  