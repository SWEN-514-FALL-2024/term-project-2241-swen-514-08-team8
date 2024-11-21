import { AccountCircle, Receipt, Search, ShoppingBag, ShoppingCart } from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartContext } from './providers/cart-count';

export default function Header({ auth }: { auth: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(location.pathname);
  const { getCartCount } = useCartContext();
  
  const cartItemCount = getCartCount();
  
  useEffect(() => {
    setPage(location.pathname);
  }, [location.pathname]);

  const handlePageChange = (_event: React.SyntheticEvent, newValue: string) => {
    setPage(newValue);
    navigate(newValue);
  };

  const badgeMargin = 1.5

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <ShoppingBag sx={{mr: 2}} fontSize='medium'/>
          <Link to='/home/products' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Serverless Ecommerce
            </Typography>
          </Link>
          <Tabs
            value={page}
            onChange={handlePageChange}
            textColor="inherit"
            TabIndicatorProps={{ style: { background: 'white' } }}
            aria-label="navigation tabs"
            sx={{ml: 'auto'}}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Search sx={{ mr: 1 }} />
                  Catalog
                </Box>
              }
              value="/home/products"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge badgeContent={cartItemCount} color="warning" sx={{ mr: badgeMargin }}>
                    <ShoppingCart />
                  </Badge>
                  Checkout
                </Box>
              }
              value="/home/checkout"
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Receipt sx={{ mr: 1 }} />
                  Transactions
                </Box>
              }
              value="/home/transactions"
            />
          </Tabs>
          {auth && (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}