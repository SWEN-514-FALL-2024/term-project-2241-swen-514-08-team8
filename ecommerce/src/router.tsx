import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminHome from "./components/admin/admin-home";
import AdminOutlet from "./components/admin/admin-outlet";
import CreateProduct from "./components/admin/create-product";
import Checkout from './components/checkout';
import ConfirmUser from "./components/confirmUser";
import ErrorPage from "./components/error-page";
import Home from './components/home';
import Login from "./components/login";
import { Products } from "./components/products";
import SignUp from "./components/signup";
import Transactions from './components/transactions';

export const router = createBrowserRouter([
  {
      index: true,
      element: <Navigate to="/login" replace />,
    }, {
      path: '/login',
      element: <Login />
    },{
      path: "/signup",
      element: <SignUp />,
    },{
      path: "/confirm",
      element: <ConfirmUser />,
    },{
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
      ]
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
      {
        path: "create",
        element: <CreateProduct />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  }, 
]);
