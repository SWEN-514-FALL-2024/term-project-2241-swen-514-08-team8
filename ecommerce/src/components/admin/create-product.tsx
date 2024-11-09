import { zodResolver } from "@hookform/resolvers/zod";
import { Cancel, Create } from "@mui/icons-material";
import { Box, Button, InputAdornment, Stack, Typography } from "@mui/material";
import {
  FormContainer,
  SelectElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import { z } from "zod";

export default function CreateProduct() {
  const form = useForm({
    defaultValues: {
      Name: "",
      Description: "",
      Price: "",
      Category: "", // Set default to empty string to avoid undefined
      Image: null,
    },
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
      })
    ),
  });

  // Using zod for schema validation. Greatly simplifies error handling
  // https://zod.dev/?id=objects

  return (
    <Box mx={"auto"} width={"fit-content"}>
      <Typography variant="h2" textAlign={"center"}>
        Create a Product
      </Typography>
      <FormContainer formContext={form}>
        <Stack direction={"column"} height={"fit-content"} gap={3}>
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
              { label: "Jewelry", id  : "jewelry" },
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
            slotProps={{ inputLabel: { shrink: true } }}
          />
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
              form.handleSubmit((data) => {
                console.log(data);
              });
            }}
          >
            Create
          </Button>
        </Stack>
      </FormContainer>
    </Box>
  );
}
