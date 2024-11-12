import {
    Box,
    Button,
    Card,
    CardActions,
    CardMedia,
    CircularProgress,
    Modal,
    Stack,
    Typography,
    SxProps,
  } from '@mui/material';
  import { useEffect, useState } from 'react';
  import { useProducts } from '../fetch/product';
  import { useNavigate } from 'react-router-dom';
  
  export type CheckoutItem = {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    amountOrdered?: number
  };

  export type User = {
    id: number;
    username: string;
    email: string;
  };

  const CustomGridStyle: SxProps = {
    border: 0,
    borderBottom: 1, 
    borderborderRadius: 0, 
    borderStyle: 'dashed', 
    boxShadow:0,
    mx: 0
  }
  
  function CheckoutItem({ checkoutItem, removeItem }: { checkoutItem: CheckoutItem, removeItem: (id: number) => void }, {}) {
    const [isOpen, setOpen] = useState(false);
    const close = () => setOpen(false);
    const open = () => setOpen(true);
  
    return (
      <>
        <Card sx={{ width: '100%'}}>
          <Box display={'flex'} flexDirection={'row'}>
            <CardMedia sx={{ m: 1 }}>
              <img
                src={checkoutItem.image}
                width={'100px'}
                height={'100px'}
                style={{ objectFit: 'cover', overflow: 'hidden', margin: 'auto' }}
              />
            </CardMedia>
            <Typography overflow={'ellipsis'} variant="h6" p={2} lineHeight={1}>
              {checkoutItem.title}
            </Typography>
          </Box>
          <CardActions>

          <Typography overflow={'ellipsis'} variant="h6" p={2} lineHeight={.5}>
              ${checkoutItem.price}
            </Typography>

            <Box
              display={'flex'}
              width={'100%'}
              height={'100%'}
              // flexDirection={'column'}
              justifyContent={'flex-end'}
              // mt={'auto'}
              ml={'auto'}
            >
              <Typography overflow={'ellipsis'} variant="h6" p={2} lineHeight={1}>
                Amount Ordered: {checkoutItem.amountOrdered} N/A
              </Typography>
              <Box flexDirection={'row'}>
                <Button onClick={open} variant="contained" color="primary" sx={{ ml: 1 }}>
                  View More
                </Button>
                <Button onClick={() => removeItem(checkoutItem.id)} variant="contained" color="error" sx={{ ml: 1 }}>
                  Remove
                </Button>
              </Box>
            </Box>
          </CardActions>
        </Card>
        {/* Modal won't take up space. */}
        <Modal open={isOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'fit-content',
              maxWidth: 1000,
              minWidth: 300,
              bgcolor: 'white',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h3">{checkoutItem.title}</Typography>
            <Box display={'inline-block'}>
              <Typography variant="body1">{checkoutItem.description}</Typography>
            </Box>
            <Box display={'flex'} width={'100%'} justifyContent={'end'}>
              <Button onClick={close} variant="contained" color="error">
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </>
    );
  }
  
  export default function Checkout() {
    const navigate = useNavigate();
    const { getProducts } = useProducts();
    const [products, setProducts] = useState<CheckoutItem[]>([]);
    const [failedRequest, setFailedRequest] = useState<boolean>(false);

    const placeholderUser: User = {id: 4, username: "John Placeholder", email: "examp1e@mail.gov"}

    const removeItem = (itemId: number) => {
      console.log(products.length)
      setProducts(products.filter((product) => product.id === itemId) as CheckoutItem[])
      console.log(products.length)
    }
  
    useEffect(() => {
      async function load() {
        const res = await getProducts();
        if (res.success) {
          setProducts(res.json as CheckoutItem[]);
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
          Checkout
        </Typography>
        <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 1,
            gridTemplateRows: 'auto',
            gridTemplateAreas: `"main main main . sidebar sidebar ."`,
        }}
        >  
            <Box sx={{ gridArea: 'main'}}>
                <Typography variant="h2" textAlign={'center'} width={1/4}>
                Cart
                </Typography>
                {products.length === 0 && (
                <CircularProgress size={40} sx={{ mx: 'auto', my: 'auto' }} />
                )}
                <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={1}
                    justifyContent={'center'}
                    sx={{border: 1}}
                >
                {failedRequest && (
                    <Typography variant='h3'>Failed to reach server. Make sure terraform is running!</Typography>)
                    }
                {products
                    .sort((p1, p2) => p1.category.localeCompare(p2.category)) // sort by category
                    .map((product, i) => (
                    <CheckoutItem key={i} checkoutItem={product} removeItem={removeItem} />
                    ))}
                </Box>
            </Box>
            {/* Personal Info */}
            <Box flexWrap={'wrap'} sx={{ gridArea: 'sidebar'}}>
                <Typography variant="h2" textAlign={'center'}>
                    Personal Info
                </Typography>
                <Box sx={{
                    width: '100%', 
                    border: 1,
                    boxShadow:0
                }}>
                    <Box>
                        <Typography variant="h5" textAlign={'left'} sx={CustomGridStyle}>
                            Name: {placeholderUser.username}
                        </Typography>

                        <Typography variant="h5" textAlign={'left'} sx={CustomGridStyle}>
                            Email: {placeholderUser.email}
                        </Typography>
                        
                        <Typography variant="h5" textAlign={'left'} sx={{...CustomGridStyle, borderBottom: 0}}>
                            Total Price: {products.length !== 0 && products
                              .map((product) => product.price)
                              .reduce((total, price) => parseFloat((total+price).toFixed(2)))
                            }
                        </Typography>
                    </Box>
                </Box>
                <Button onClick={() => navigate('/home/transactions')} variant="contained" color="primary" sx={{mt: 1}}>
                    Purchase
                </Button>
            </Box>
        </Box>
      </Stack>
    );
  }
  