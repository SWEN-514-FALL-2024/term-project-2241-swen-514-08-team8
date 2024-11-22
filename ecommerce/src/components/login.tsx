// Login.tsx
import { AuthFlowType, CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../fetch/accessToken";
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
      "idToken",
      response.AuthenticationResult?.IdToken || "",
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
      const accessToken = await loginUser(email, password);
      if (accessToken){
        setToken(accessToken);
        // alert("User logged in successfully!");
        navigate("/home");
      }
      
    } catch (error) {
      alert("Error logging in: " + error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper variant="elevation" sx={{padding: 3, pt: 0}}>
      <Box
        sx={{
          mt: '45%',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <Typography variant="h1" textAlign="center" style={{  fontFamily: "Roboto, sans-serif"}}>
          Log in
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
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
          Don't have an account?{" "}
          <Link href="#" variant="body2" onClick={() => navigate("/signup")}>
            Sign Up
          </Link>
          </Typography>
         
        </Box>
      </Box>
      </Paper>
    </Container>
  );
}
