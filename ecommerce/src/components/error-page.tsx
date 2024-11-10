import { Box, Typography } from "@mui/material";

export default function ErrorPage() {
  return (
    <>
      <meta http-equiv="refresh" content="2; url=/" />
      <Box p={3} width="fit-content" mx={"auto"}>
        <Typography variant="h1" textAlign={"center"}>
          Page Not Found
        </Typography>
        <Typography variant="body1" textAlign={"center"} mt={1}>
          Redirecting you to the homepage in 2 seconds...
        </Typography>
        <Typography variant="body1" textAlign={"center"}>
          If you're not redirected, <a href="/">click here</a>.
        </Typography>
      </Box>
    </>
  );
}
