/* eslint-disable @typescript-eslint/no-unused-vars */
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authConfig } from "../authConfgure";

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
<Box display="flex" justifyContent="center" alignItems="center" height="90vh">
      <Paper variant="elevation" sx={{ px: 3, borderRadius: '10%', height: 'fit-content', width: 'fit-content', pt: 1, pb: 3 }}>
        <Typography variant="h3" textAlign="start" style={{ fontFamily: "Roboto, sans-serif" }} mt={1} className="theme-title-text">
          Confirm Account
        </Typography>
        <Box component="form" width={'fit-content'} onSubmit={(e) => e.preventDefault()}>
          <Stack width={'400px'} mt={2} gap={1}>
            <TextField
              required
              fullWidth
              label="Username or Email"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Confirmation Code"
              autoComplete="off"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />
          </Stack>
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
      </Paper>
    </Box>
    );
  };

export default ConfirmUser;
