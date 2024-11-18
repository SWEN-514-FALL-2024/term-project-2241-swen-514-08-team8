import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function AdminHeader() {
  return (
    <Link to="/admin" style={{ textDecoration: "none" }}>
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
    </Link>
  );
}
