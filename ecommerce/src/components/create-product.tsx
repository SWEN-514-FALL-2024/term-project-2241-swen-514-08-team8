import { Box, Stack, Typography } from '@mui/material';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';

export default function CreateProduct() {
  const form = useForm();

  return (
    <Box>
      <Typography variant="h3">Create a Product</Typography>
      <Stack direction={'column'}>
        <FormContainer formContext={form}>
          <TextFieldElement name="Name" label="Name" />
          <TextFieldElement name="Description" label="Description" />
          <TextFieldElement name="" type="file" />
        </FormContainer>
      </Stack>
    </Box>
  );
}
