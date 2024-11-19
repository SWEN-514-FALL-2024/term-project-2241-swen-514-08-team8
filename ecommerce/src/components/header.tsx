import { AccountCircle, ShoppingBag } from '@mui/icons-material';
import { AppBar, Box, IconButton, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header({ auth }: { auth: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(location.pathname);

  useEffect(() => {
    setPage(location.pathname);
  }, [location.pathname]);

  const handlePageChange = (event: React.SyntheticEvent, newValue: string) => {
    setPage(newValue);
    navigate(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <ShoppingBag sx={{mr: 2}} fontSize='medium'/>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Serverless Ecommerce
          </Typography>
          <Tabs
            value={page}
            onChange={handlePageChange}
            textColor="inherit"
            TabIndicatorProps={{ style: { background: "white" } }}
            aria-label="navigation tabs"
          >
            <Tab label="View Products" value="/home/products" />
            <Tab label="Checkout" value="/home/checkout" />
            <Tab label="Transactions" value="/home/transactions" />
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