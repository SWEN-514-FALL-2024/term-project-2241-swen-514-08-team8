import { createBrowserRouter, Navigate } from 'react-router-dom';
import CreateProduct from './components/create-product';
import Home from './components/home';
import Products from './components/products';
import Checkout from './components/checkout'
import Login from './components/login';
import SignUp  from './components/signup';
import ConfirmUser from './components/confirmUser';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <SignUp/>
  },
  {
    path: '/confirm',
    element: <ConfirmUser/>
  },
  {
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
    ],
  },
  
]);
