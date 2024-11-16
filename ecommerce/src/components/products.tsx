import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useCart, useProducts } from '../fetch/product';

export type Product = {
  ProductId: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating_rate: number;
  rating_count: number;
};

export type Cart = {
  id: Number;
  quantity: Number;
};

function Product({ product }: { product: Product }) {
  const [isOpen, setOpen] = useState(false);
  const close = () => setOpen(false);
  const open = () => setOpen(true);

  return (
    <>
      <Card sx={{ width: '450px' }}>
        <Box display={'flex'} flexDirection={'row'}>
          <CardMedia sx={{ m: 3 }}>
            <img
              src={product.image}
              width={'150px'}
              height={'150px'}
              style={{ objectFit: 'cover', overflow: 'hidden', margin: 'auto' }}
            />
          </CardMedia>
          <Typography overflow={'clip'} variant="h5" p={3} lineHeight={1}>
            {product.title}
          </Typography>
        </Box>
        <CardContent>
          <Typography>
            Ratings: {product.rating_rate} ({product.rating_count})
          </Typography>
        </CardContent>
        <CardActions>
          <Box
            display={'flex'}
            width={'100%'}
            height={'100%'}
            justifyContent={'end'}
            mt={'auto'}
          >            
            <Button onClick={() => handleAddToCart(product.ProductId)} variant="contained" color="secondary">
              Add to Cart
            </Button>
            <Button onClick={open} variant="contained" color="primary">
              View More
            </Button>
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
          <Typography variant="h3">{product.title}</Typography>
          <Box display={'inline-block'}>
            <Typography variant="body1">{product.description}</Typography>
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

const handleAddToCart = async (productId: number) => {
  const { addToCart } = useCart();
  addToCart({id: productId, quantity: 1} as Cart)
};

export default function Products() {
  const { getProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [failedRequest, setFailedRequest] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const res = await getProducts();
      if (res.success) {
        setProducts(res.json as Product[]);
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
        Products
      </Typography>
      {products.length === 0 && (
        <CircularProgress size={40} sx={{ mx: 'auto', my: 'auto' }} />
      )}
      <Box
        flexWrap={'wrap'}
        display={'flex'}
        flexDirection={'row'}
        gap={3}
        mx={'auto'}
        width={'fit-content'}
        justifyContent={'center'}
      >
        {failedRequest && (
          <Typography variant='h3'>Failed to reach server. Make sure terraform is running!</Typography>)
          }
        {/* <Product product={products[0]} /> */}
        {products
          .sort((p1, p2) => p1.category.localeCompare(p2.category)) // sort by category
          .map((product, i) => (
            <Product key={i} product={product} />
          ))}
      </Box>
    </Stack>
  );
}
