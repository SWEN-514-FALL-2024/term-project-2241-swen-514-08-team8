import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminHome from "./components/admin/admin-home";
import AdminOutlet from "./components/admin/admin-outlet";
import CreateProduct from "./components/admin/create-product";
import ConfirmUser from "./components/auth/confirmUser";
import Login from "./components/auth/login";
import SignUp from "./components/auth/signup";
import Checkout from './components/checkout';
import ErrorPage from "./components/error-page";
import Home from './components/home';
import { Products } from "./components/products";
import Transactions from './components/transactions';

const isAuthenticated = () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken === "") {
    return false;
  }
  return !!accessToken;
};

export const router = createBrowserRouter([
  {
      index: true,
      element: <Navigate replace to="/login" />,
    }, {
      path: '/login',
      element: isAuthenticated() ? <Navigate to="/home/products" /> : <Login />
    },{
      path: "/signup",
      element: <SignUp />,
    },{
      path: "/confirm",
      element: <ConfirmUser />,
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
          path: "create-product",
          element: <CreateProduct />,
        },
      ],
    }, {
    path: '/home',
    element: isAuthenticated() ? <Home /> : <Navigate replace to="/login" />,
    children: [
      {
        // Redirects the root page '/' to /products.
        index: true,
        element: isAuthenticated() ? <Navigate to="products" replace /> : <Navigate replace to="/login" />,
        // element: <></>
      },
      {
        path: "products",
        element: isAuthenticated() ? <Products /> : <Navigate replace to="/login" />,
      },
      {
        path: "checkout",
        element: isAuthenticated() ? <Checkout /> : <Navigate replace to="/login" />,
      },
      {
        path: "transactions",
        element: isAuthenticated() ? <Transactions /> : <Navigate replace to="/login" />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  }, 
]);
