import {
    Box,
    Card,
    CircularProgress,
    Stack,
    Typography,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import { useProducts } from '../fetch/product';
  
  export type TransactionItem = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating_rate: number;
    rating_count: number;
  };
  
  export type Transaction = {
    id: number;
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
          <Box display={'flex'} flexDirection={'row'}>
            <Typography overflow={'ellipsis'} variant="body1" p={2} lineHeight={1}>
              {transactionItem.title}
            </Typography>
          </Box>
        </Card>
      </>
    );
  }

  function Transaction({ transaction }: { transaction: Transaction }) {
    const { getProducts } = useProducts();
    const [products, setProducts] = useState<TransactionItem[]>([]);
    const [failedRequest, setFailedRequest] = useState<boolean>(false);

    useEffect(() => {
        async function load() {
          const res = await getProducts();
          if (res.success) {
            setProducts(res.json as TransactionItem[]);
          } else {
            setFailedRequest(true);
          }
        }
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  
    return (
      <>
        <Card sx={{ width: '100%', border: 1, borderRadius: 0,}}>
          <Box display={'flex'} flexDirection={'row'}>
            <Typography overflow={'ellipsis'} variant="h5" p={2} lineHeight={1}>
              Transaction #{transaction.id}
            </Typography>
          </Box>
        </Card>
        {products.length === 0 && (
            <CircularProgress size={40} sx={{ mx: 'auto', my: 'auto' }} />
            )}
            <Box
                flexDirection={'column'}
                gap={1}
                justifyContent={'center'}
                sx={{mt: 0, border: 1, width: '90%', borderLeft: 1, borderRight: 1, ml: 3}}
            >
                {failedRequest && (
                    <Typography variant='h3'>Failed to reach server. Make sure terraform is running!</Typography>)
                    }
                {products.map((product, i) => (
                    <TransactionItem key={i} transactionItem={product} />
                ))}
            </Box>
      </>
    );
  }
  
  export default function Transactions() {
    const placeholderTransaction: Transaction = {id: 55555555}
  
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
        }}
        >  
            <Box sx={{ gridArea: 'main', elevation: 0}}>
                <Transaction key={4554} transaction={placeholderTransaction} />
            </Box>
        </Box>
      </Stack>
    );
  }
  