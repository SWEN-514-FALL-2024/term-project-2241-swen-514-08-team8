import { Box } from "@mui/material";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./admin-header";

export default function AdminOutlet() {
  useEffect(() => {
    // Check for admin permissions
  }, []);
  return (
    <Box>
      <AdminHeader />
      <Outlet />
    </Box>
  );
}
