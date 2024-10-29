import { createBrowserRouter, Navigate } from 'react-router-dom';
import CreateProduct from './components/create-product';
import Home from './components/home';
import Products from './components/products';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        index: true,
        element: <Navigate to="/products" replace />,
      },
      {
        path: '/products',
        element: <Products />,
      },
      {
        path: '/create',
        element: <CreateProduct />,
      },
    ],
    // errorElement: <Navigate to="/products" />,
  },
]);
