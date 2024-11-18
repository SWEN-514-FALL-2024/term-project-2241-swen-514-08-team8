import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../alerts";

export default function AdminHome() {
  const nav = useNavigate();
  const { notify } = useNotification();

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
          <Button
            fullWidth
            sx={{ py: 3 }}
            variant="contained"
            onClick={() => nav("/admin/create-product")}
          >
            Create Product
          </Button>
          <Button fullWidth sx={{ py: 3 }} variant="contained" onClick={()=> {
            notify("This feature is not yet implemented.", 'info');
          }}>
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
