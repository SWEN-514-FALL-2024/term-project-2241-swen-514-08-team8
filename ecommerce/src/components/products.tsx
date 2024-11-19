import {
  Box,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useCart, useProducts } from '../fetch/product';
import { Cart, ProductType } from "../types";
import Product from "./product";
import { useNotification } from "./alerts";

function Products() {
  const { getProducts } = useProducts();
  const { notify } = useNotification();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [failedRequest, setFailedRequest] = useState<boolean>(false);
  const { addToCart } = useCart();


  const handleAddToCart = async (productId: number) => {
    const itemId = uuidv4();
    addToCart({id: itemId, productId: productId, quantity: 1, transactionId: "0", itemStatus: "Added"} as Cart)
    notify("Item added to cart", "success");
  };

  useEffect(() => {
    async function load() {
      const res = await getProducts();
      if (res.success) {
        setProducts(res.json as ProductType[]);
      } else {
        setFailedRequest(true);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction={"column"}>
      <Typography variant="h1" textAlign={"center"}>
        Products
      </Typography>
      {products.length === 0 && (
        <CircularProgress size={40} sx={{ mx: "auto", my: "auto" }} />
      )}
      <Box
        flexWrap={"wrap"}
        display={"flex"}
        flexDirection={"row"}
        gap={3}
        mx={"auto"}
        width={"fit-content"}
        justifyContent={"center"}
      >
        {failedRequest && (
          <Typography variant="h3">
            Failed to reach server. Make sure terraform is running!
          </Typography>
        )}
        {/* <Product product={products[0]} /> */}
        {products
          .sort((p1, p2) => p1.category.localeCompare(p2.category)) // sort by category
          .map((product, i) => (
            <Product key={i} product={product} handleAddToCart={handleAddToCart}/>
          ))}
      </Box>
    </Stack>
  );
}

export { Products };

