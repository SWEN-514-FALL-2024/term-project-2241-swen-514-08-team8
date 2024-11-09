import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack, Typography } from "@mui/material";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { z } from "zod";

export default function CreateProduct() {
  const form = useForm();

  // Using zod for schema validation. Greatly simplifies error handling
  // https://zod.dev/?id=objects
  const resolver = zodResolver(
    z.object({
      Name: z.string().min(1, "Name is required"),
      Description: z.string().min(1, "Description is required"),
      Image: z.any(),
    })
  );

  return (
    <Box height={"100%"}>
      <Typography variant="h3">Create a Product</Typography>
      <Stack direction={"column"}>
        <FormContainer formContext={form} resolver={resolver}>
          <TextFieldElement name="Name" label="Name" />
          <TextFieldElement name="Description" label="Description" />
          <TextFieldElement name="" type="file" />
        </FormContainer>
      </Stack>
    </Box>
  );
}
