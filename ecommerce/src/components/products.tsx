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
import { useProducts } from '../fetch/product';

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating_rate: number;
  rating_count: number;
};

function Product({ product }: { product: Product }) {
  const [isOpen, setOpen] = useState(false);
  const close = () => setOpen(false);
  const open = () => setOpen(true);

  return (
    <>
      <Card sx={{}}>
        <CardMedia>
          <img
            src={product.image}
            width={'fit-content'}
            height={'150px'}
            style={{ objectFit: 'cover', overflow: 'hidden', margin: 'auto' }}
          />
        </CardMedia>
        <Typography overflow={'clip'} variant="h5">
          {product.title}
        </Typography>
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

export default function Products() {
  const { getProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getProducts();
      if (res.success) {
        setProducts(res.json as Product[]);
      }
    }
    load();
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
        {/* <Product product={products[0]} /> */}
        {products.map((product, i) => (
          <Product key={i} product={product} />
        ))}
      </Box>
    </Stack>
  );
}
