import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Modal,
  Rating,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCart, useProducts } from '../fetch/product';
import {v4 as uuidv4} from 'uuid';

export type Product = {
  ProductId: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating_rate: number;
  rating_count: number;
};


export type Cart = {
  id: String;
  productId: Number;
  quantity: Number;
  transactionId: String;
  itemStatus: String;
};

function Product({ product }: { product: Product }) {
  const [isOpen, setOpen] = useState(false);
  const close = () => setOpen(false);
  const open = () => setOpen(true);

  return (
    <>
      <Card sx={{ 
        width: "450px",
        transition: 'transform 0.3s ease-in-out',
        ":hover": {
          transform: "scale(1.01)",
        }}}>
        <CardMedia image={product.image} component={'img'} sx={{
          width: '100%',
          height: 200, // Set a consistent height for all images
          objectFit: 'cover', // Ensure the image covers the area without distortion
        }}> 
        </CardMedia>
        <Stack p={2} divider={<Divider/>} gap={2}>
          <Box>
            <Typography variant="h5" lineHeight={1}   
              sx={{
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  textOverflow: 'ellipsis',
                }}>
              {product.title}
            </Typography>
            <Stack gap={2} direction={'row'} mt={1}>
              <Rating value={product.rating_rate}  precision={.1} readOnly />              
              <Typography>
                ({product.rating_count})
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <CardActions>
          <Box
            display={"flex"}
            width={"100%"}
            height={"100%"}
            justifyContent={"end"}
            mt={"auto"}
          >
            <Box flexGrow={1} ml={1}>
              <Chip color="success" label={`$${product.price ?? 0}`} />
            </Box>          
            <Button onClick={() => handleAddToCart(product.ProductId)} variant="contained" color="secondary">
              Add to Cart
            </Button>
            <Button onClick={open} variant="contained" color="primary">
              View More
            </Button>
          </Box>
        </CardActions>
      </Card>
      {/* Modal won't take up space. */}
      <Modal open={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "fit-content",
            maxWidth: 1000,
            minWidth: 300,
            bgcolor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h3">{product.title}</Typography>
          <Box display={"inline-block"}>
            <Typography variant="body1">{product.description}</Typography>
          </Box>
          <Box display={"flex"} width={"100%"} justifyContent={"end"}>
            <Button onClick={close} variant="contained" color="error">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

const handleAddToCart = async (productId: number) => {
  const { addToCart } = useCart();
  const itemId = uuidv4();
  addToCart({id: itemId, productId: productId, quantity: 1, transactionId: "0", itemStatus: "Added"} as Cart)
};

export default function Products() {
  const { getProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>([]);
  const [failedRequest, setFailedRequest] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      const res = await getProducts();
      if (res.success) {
        setProducts(res.json as Product[]);
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
            <Product key={i} product={product} />
          ))}
      </Box>
    </Stack>
  );
}
