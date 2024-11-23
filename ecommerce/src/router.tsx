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
        // element: <></>
      },
      {
        path: "products",
        element: <Products />,
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
