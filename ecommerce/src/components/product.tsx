import { Box, Button, Card, CardActions, CardMedia, Chip, Divider, Modal, Rating, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { ProductType } from "../types";

export default function Product({ product, handleAddToCart }: { product: ProductType, handleAddToCart: (productId: number) => void }) {
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