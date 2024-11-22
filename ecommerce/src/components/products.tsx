import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useCart, useProducts } from '../fetch/product';
import { Cart, ProductType } from '../types';
import Product from "./product";
import { useNotification } from "./providers/alerts";
import { useCartContext } from "./providers/cart-count";

function Products() {
  const { getProducts } = useProducts();
  const { notify } = useNotification();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [category, setCategory] = useState<string>('All');
  const [failedRequest, setFailedRequest] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { addToCart } = useCart();
  const { refreshCartCount } = useCartContext();

  const handleAddToCart = async (productId: number) => {
    const itemId = uuidv4();
    addToCart({id: itemId, productId: productId, quantity: 1, transactionId: "0", itemStatus: "Added"} as Cart)
    notify("Item added to cart", "success");
    await refreshCartCount()
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await getProducts();
      if (res.success) {
        setProducts(res.json as ProductType[]);
        setFilteredProducts(res.json as ProductType[]);
        setLoading(false);
      } else {
        setFailedRequest(true);
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = products;

      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (category !== 'All') {
        filtered = filtered.filter(product => product.category === category);
      }

      setFilteredProducts(filtered);
      setLoading(false);
    }, 500); // Simulates delay for loading. (UX)
  };

  return (
    <Stack direction={"column"} spacing={2}>
      <Typography variant="h1" textAlign={"center"}>
        Product Catalog
      </Typography>
      <Box display="flex" justifyContent="center" gap={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormControl variant="outlined">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as string)}
            label="Category"
            sx={{ minWidth: 150 }} // Adjust this value as needed
          >
            <MenuItem value="All">All</MenuItem>
            {[...new Set(products.map(product => product.category))].map((category, i) => (
              <MenuItem key={i} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSearch} startIcon={<Search />}>
          Search
        </Button>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress size={40} />
        </Box>
      ) : (
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
          {filteredProducts
            .sort((p1, p2) => p1.category.localeCompare(p2.category)) // sort by category
            .map((product, i) => (
              <Product key={i} product={product} handleAddToCart={handleAddToCart}/>
            ))}
        </Box>
      )}
    </Stack>
  );
}

export { Products };
