import { Box, Button, Stack, Typography } from "@mui/material";

export default function AdminHome() {
  return (
    <>
      <Box mt={3}>
        <Typography variant="h5" textAlign={"center"}>
          Here you can make changes to the products in our application.
        </Typography>
      </Box>
      <Stack
        direction={"row"}
        width="fit-content"
        height={"fit-content"}
        gap={3}
        mx="auto"
        mt={3}
      >
        <Stack direction={"column"} gap={3} width={"600px"} mx={"auto"}>
          <Typography variant="h2" textAlign={"center"}>
            Product Operations
          </Typography>
          <Button fullWidth sx={{ py: 3 }} variant="contained">
            Create Product
          </Button>
          <Button fullWidth sx={{ py: 3 }} variant="contained">
            Modify Products
          </Button>
        </Stack>
        <Stack direction={"column"} gap={3} width={"600px"} mx={"auto"}>
          <Typography variant="h2" textAlign={"center"}>
            Cart Operations
          </Typography>
          <Button fullWidth sx={{ py: 3 }} variant="contained">
            View Carts
          </Button>
        </Stack>
      </Stack>
    </>
  );
}
