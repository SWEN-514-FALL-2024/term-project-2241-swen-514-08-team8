import { AccountCircle, Close, Computer, Logout, ShoppingBag } from "@mui/icons-material";
import { AppBar, Box, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event : React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setAnchorEl(null);
  };

  const handleSignOut = () => {
    console.log("User signed out");
    setAnchorEl(null);
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
    <Box sx={{ flexGrow: 1, mt: 10 }}>
      <AppBar position="fixed" color="error">
        <Toolbar>
          <ShoppingBag sx={{mr: 2}} fontSize='medium'/>
          <Link to='/admin/' style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              [ADMIN] Serverless Ecommerce
            </Typography>
          </Link>
          <Box ml='auto'>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircle />
              <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => navigate('/home')}>
                    <ListItemIcon>
                      <Computer />
                    </ListItemIcon>
                    Back To Customer Page
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    Sign Out
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose}>
                    <ListItemIcon>
                      <Close />
                    </ListItemIcon>
                    Close
                  </MenuItem>
                </Menu>
            </IconButton>
            </Box>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  );
}
