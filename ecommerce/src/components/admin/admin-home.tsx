import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const nav = useNavigate();

  return (
    <>
      <Paper sx={{width: 'fit-content', p: 4, mx: 'auto', mt: 3}}>
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
            <Box mt={3}>
              <Typography variant="h5" textAlign={"center"}>
                Here you can make changes to the products in our application.
              </Typography>
            </Box>
            <Button
              fullWidth
              sx={{ py: 3 }}
              variant="contained"
              onClick={() => nav("/admin/create-product")}
              color='error'
            >
              Create Product
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
