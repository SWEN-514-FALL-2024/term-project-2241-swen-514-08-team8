import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./header";

export default function Home() {
  return (
    <Box>
        <Header />
        <Outlet />
    </Box>
  );
}
