import { Box, Typography } from "@mui/material";

export default function AdminHeader() {
  return (
    <Box height={"fit-content"} width={"100%"} bgcolor={"red"}>
      <Typography
        variant="h1"
        textAlign={"center"}
        color="white"
        fontStyle={"italic"}
      >
        Ecommerce Admin Panel
      </Typography>
    </Box>
  );
}
