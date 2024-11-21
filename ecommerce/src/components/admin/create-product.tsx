import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel, Create } from "@mui/icons-material";
import { Box, Button, InputAdornment, Stack, Typography } from "@mui/material";
import { useState } from "react";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { z } from "zod";

import Product from "../product";
import { useNotification } from "../providers/alerts";

export default function CreateProduct() {
  const form = useForm({
    defaultValues: {
      Name: "",
      Description: "",
      Price: 0,
      Category: "", // Set default to empty string to avoid undefined
      Image: null as string | null,
      RatingCount: 0,
      RatingStars: 0.0,
    },
    // Using zod for schema validation. Greatly simplifies error handling
    // https://zod.dev/?id=objects
    resolver: zodResolver(
      z.object({
        Name: z.string().min(1, "Name is required"),
        Description: z.string().min(1, "Description is required"),
        Price: z
          .number()
          .positive("Price must be positive")
          .min(0.01, "Price must be at least 0.01"),
        Category: z.string().min(1, "Category is required"),
        Image: z.any(),
        RatingCount: z.coerce.number().int().min(1, "Rating count must be positive"),
        RatingStars: z.coerce
          .number()
          .min(0, "Rating stars must be positive")
          .max(5, "Rating stars must be less than or equal to 5"),
      })
    ),
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { notify } = useNotification();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('Image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const watched = form.watch(
    [
      "Name",
      "Description",
      "Price",
      "Category",
      "Image",
      "RatingCount",
      "RatingStars",
    ],
    {
      Name: "Name",
      Description: "A description",
      Price: 300,
      Category: "Men's Clothing",
      Image: null,
      RatingCount: 0,
      RatingStars: 0.0,
    }
  );

  return (
    <Box mx={"auto"} width={"fit-content"}>
      <Typography variant="h2" textAlign={"center"}>
        Create a Product
      </Typography>
      <Stack direction={"row"} gap={3}>
        <FormContainer formContext={form}>
          <Stack direction={"column"} height={"fit-content"} gap={1}>
            <TextFieldElement
              name="Name"
              label="Name"
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextFieldElement
              name="Description"
              label="Description"
              slotProps={{ inputLabel: { shrink: true } }}
            />{" "}
            <SelectElement
              name="Category"
              label="Category"
              slotProps={{ inputLabel: { shrink: true } }}
              options={[
                { label: "Men's Clothing", id: "mens_clothing" },
                { label: "Women's Clothing", id: "womens_clothing" },
                { label: "Electronics", id: "electronics" },
                { label: "Jewelry", id: "jewelry" },
              ]}
            />
            <TextFieldElement
              type="number"
              name="Price"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
              }}
              label="Price"
            />
            <TextFieldElement
              name="ProductImage"
              type="file"
              label="Product Photo"
              onChange={handleImageUpload}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Stack direction={"row"} gap={2}>
              <TextFieldElement
                name="RatingCount"
                type="number"
                label="# of Ratings"
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextFieldElement
                name="RatingStars"
                type="number"
                label="# of Stars (out of 5)"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
          </Stack>
          <Stack direction={"row"} gap={2} mt={3}>
            <Button
              color="error"
              fullWidth
              variant="contained"
              startIcon={<Cancel />}
            >
              Cancel
            </Button>
            <Button
              color="success"
              fullWidth
              variant="contained"
              startIcon={<Create />}
              onClick={() => {
                form.handleSubmit(() => {
                  notify("Product created successfully", "success");
                })();
              }}
            >
              Create
            </Button>
          </Stack>
        </FormContainer>
        <Box>
            <Typography variant="h3">Preview</Typography>
            {
              // "Name",
              // "Description",
              // "Price",
              // "Category",
              // "Image",
              // "RatingCount",
              // "RatingStars",
            <Product
              product={{
                ProductId: -1,
                title: watched[0],
                description: watched[1],
                price: watched[2],
                category: watched[3],
                image: imagePreview || "https://via.placeholder.com/150",
                rating_count: watched[5],
                rating_rate: watched[6],
              }}
              handleAddToCart={() => {}} // No need to add to cart
            />
          }
        </Box>
      </Stack>
    </Box>
  );
}
