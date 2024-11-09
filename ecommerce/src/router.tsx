import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./components/home";
import Products from "./components/products";
import Login from "./components/login";
import SignUp from "./components/signup";
import ConfirmUser from "./components/confirmUser";
import AdminOutlet from "./components/admin/admin-outlet";
import AdminHome from "./components/admin/admin-home";
import CreateProduct from "./components/admin/create-product";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/confirm",
    element: <ConfirmUser />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        // Redirects the root page '/' to /products.
        index: true,
        element: <Navigate to="products" replace />,
      },
      {
        path: "products",
        element: <Products />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminOutlet />,
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        index: true,
        element: <CreateProduct />,
      },
    ],
  },
]);
