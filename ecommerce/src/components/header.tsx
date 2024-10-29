import { AccountCircle, ShoppingCart } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <Box
      width={'100%'}
      height={'70px'}
      bgcolor={'grey.200'}
      justifyItems={'center'}
      display={'flex'}
      flexDirection={'row'}
    >
      <Box ml={1} my={'auto'}>
        <Typography variant="h3" my={'auto'}>
          <ShoppingCart fontSize="large" />
          Serverless Ecommerce
        </Typography>
      </Box>
      <Box ml={'auto'} my={'auto'} mr={3} gap={3} width={'fit-content'}>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate('/products')}
        >
          <Typography variant="h5">Products</Typography>
        </Button>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate('/create')}
        >
          <Typography variant="h5">Create Product</Typography>
        </Button>
      </Box>
      <Box my={'auto'} mr={3}>
        <AccountCircle sx={{ fontSize: '50px' }} />
      </Box>
    </Box>
  );
}
