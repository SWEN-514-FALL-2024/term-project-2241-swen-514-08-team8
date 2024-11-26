 
import { Add, ShoppingCart } from "@mui/icons-material";
import { Box, Button, ButtonBase, Card, CardActions, CardMedia, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Modal, Rating, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { ProductType } from "../types";

export default function Product({ product, handleAddToCart }: { product: ProductType, handleAddToCart: (productId: number, quantity: number) => void }) {
  const [isOpen, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const close = () => setOpen(false);
  const open = () => setOpen(true);

  const handleDialogOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAddToCartClick = () => {
    handleAddToCart(product.ProductId, quantity);
    setDialogOpen(false);
  };

  return (
    <>
      <ButtonBase onClick={open} disableRipple sx={{ width: '100%' }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: "450px",
            transition: 'transform 0.3s ease-in-out',
            ":hover": {
              transform: "scale(1.01)",
              boxShadow: 5,
            },
            boxShadow: 3,
          }}
        >
          <CardMedia
            image={product.image}
            component={'img'}
            sx={{
              width: '100%',
              height: 200,
              objectFit: 'cover',
            }}
          />
          <Box p={2}>
            <Typography
              variant="h5"
              lineHeight={1}
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                textOverflow: 'ellipsis',
                height: '48px',
              }}
            >
              {product.title}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <Rating value={product.rating_rate} precision={0.1} readOnly />
              <Typography sx={{ ml: 1 }}>
                ({product.rating_count})
              </Typography>
            </Box>
          </Box>
          <CardActions>
            <Box
              display={"flex"}
              width={"100%"}
              height={"100%"}
              justifyContent={"end"}
              mt={"auto"}
            >
              <Box ml={1} mr={'auto'}>
                <Chip color="info" label={`$${product.price ?? 0}`} />
              </Box>
              <Button
                onClick={handleDialogOpen}
                variant="contained"
                color="info"
                startIcon={<Add />}
              >
                Add to Cart
              </Button>
            </Box>
          </CardActions>
        </Card>
      </ButtonBase>
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
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add to Cart</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the quantity of products you want to add to the cart.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            sx={{mb: 3}}
            InputProps={{
              inputProps: { min: 1 },
              endAdornment: (
                <InputAdornment position="end">
                  <ShoppingCart />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddToCartClick} color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}