// SignUp.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box, TextField, Button, Typography, Container, Link} from "@mui/material";
import {CognitoIdentityProviderClient, SignUpCommand} from "@aws-sdk/client-cognito-identity-provider";
import { authConfig } from "./authConfgure";

const cognitoClient = new CognitoIdentityProviderClient({ region: authConfig.Region });


export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUpUser = async (email: string, password: string) => {
    const command = new SignUpCommand({
      ClientId: authConfig.ClientId,
      Username: email,
      Password: password,
    });
    
    try {
      const response = await cognitoClient.send(command);
      console.log("User signed up:", response);
      return response;
    } catch (error) {
      console.error("Error signing up user:", error);
      throw error;
    }
  }

  const handleSignUp = async () => {
    try {
      await signUpUser(email, password);
      alert("User signed up successfully!");
      navigate("/confirm");
    } catch (error) {
      alert("Error signing up: " + error);
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
        <Typography component="h1" variant="h5" textAlign="center">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 1 }}>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignUp}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
          Already have an account?
          <Link href="#" variant="body2" onClick={() => navigate("/")}>
            {"Log In"}
          </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
