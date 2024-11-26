import { Box } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminHeader from "./admin-header";

export default function AdminOutlet() {
  const navigate = useNavigate();
  useEffect(() => {
    // Check for admin permissions
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/login');
    }
  }, []);
  return (
    <Box>
      <AdminHeader />
      <Outlet />
    </Box>
  );
}
