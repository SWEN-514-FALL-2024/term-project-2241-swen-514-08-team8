// Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box, TextField, Button, Typography, Container, Link} from "@mui/material";
import {CognitoIdentityProviderClient, InitiateAuthCommand, AuthFlowType} from "@aws-sdk/client-cognito-identity-provider";
import { authConfig } from "./authConfgure";


const cognitoClient = new CognitoIdentityProviderClient({ region: authConfig.Region });

const loginUser = async (email: string, password: string) =>  {
  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: authConfig.ClientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  try {
    const response = await cognitoClient.send(command);
    console.log("User logged in:", response);

    sessionStorage.setItem(
      "accessToken",
      response.AuthenticationResult?.AccessToken || "",
    );
    
    return response.AuthenticationResult?.AccessToken;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      alert("User logged in successfully!");
      navigate("/home");
    } catch (error) {
      alert("Error logging in: " + error);
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
          textAlign: "center"
        }}
      >
        <Typography component="h1" variant="h5" textAlign="center">
          Log in
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
          Don't have an account?   
          <Link href="#" variant="body2" onClick={() => navigate("/signup")}>
            {"Sign Up"}
          </Link>
          </Typography>
         
        </Box>
      </Box>
    </Container>
  );
}
