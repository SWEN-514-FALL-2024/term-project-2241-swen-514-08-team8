/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { useNavigate } from "react-router-dom";
import {Box, TextField, Button, Typography, Container, Alert} from "@mui/material";
import { authConfig } from "./authConfgure";

const cognitoClient = new CognitoIdentityProviderClient({ region: authConfig.Region });

async function confirmUser(email: string, confirmationCode: string) {
  const command = new ConfirmSignUpCommand({
    ClientId: authConfig.ClientId, // Your Cognito User Pool Client ID
    Username: email,
    ConfirmationCode: confirmationCode,
  });

  try {
    const response = await cognitoClient.send(command);
    console.log("User confirmed successfully:", response);
    alert("Your account has been confirmed! You can now log in.");
  } catch (error) {
    console.error("Error confirming user:", error);
    alert("Failed to confirm user. Please check the confirmation code and try again.");
  }
}

const ConfirmUser = () => {
    const [username, setUsername] = useState("");
    const [confirmationCode, setConfirmationCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleConfirm = async () => {
      setMessage("");
      setError("");
      try {
        await confirmUser(username, confirmationCode);
        setMessage("Account confirmed! Redirecting to login...");
        navigate("/"); // Redirect after 2 seconds

      } catch (error) {
        setError("Error confirming account. Please try again.");
      }
    };
  
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Confirm Your Account
          </Typography>
          <Box component="form" onSubmit={(e) => e.preventDefault()} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username or Email"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmation Code"
              autoComplete="off"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleConfirm}
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm Account
            </Button>
            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </Box>
      </Container>
    );
  };

export default ConfirmUser;
