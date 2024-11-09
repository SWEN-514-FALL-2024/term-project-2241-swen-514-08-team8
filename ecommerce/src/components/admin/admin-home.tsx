import { Box, Button, Typography } from "@mui/material";

export default function AdminHome() {
  return (
    <Box>
      <Typography variant="h1">Admin Panel</Typography>
      <Button fullWidth sx={{ py: 3 }}>
        Create Product
      </Button>
      <Button fullWidth sx={{ py: 3 }}>
        Browse Products
      </Button>
    </Box>
  );
}
