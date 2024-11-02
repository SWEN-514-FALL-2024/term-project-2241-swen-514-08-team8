import { createBrowserRouter, Navigate } from 'react-router-dom';
import CreateProduct from './components/create-product';
import Home from './components/home';
import Products from './components/products';
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
    ],
    // errorElement: <Navigate to="/products" />,
  },
  
]);
