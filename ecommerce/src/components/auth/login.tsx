// Login.tsx
import { AuthFlowType, CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { setToken } from "../../fetch/accessToken";
import { authConfig } from "../authConfgure";
import '../../text-gradient.css';

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
    
    return response.AuthenticationResult;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const form = useForm({ 
    resolver: zodResolver(z.object({
      email: z.string().email(),
      password: z.string().min(1, "Password is required"),
    })),
  })


  const handleLogin = async () => {
    form.handleSubmit(async () => {
      try {
        const authenticationResult = await loginUser(email, password);
        if (authenticationResult){
          sessionStorage.setItem(
            "idToken",
            authenticationResult?.IdToken || "",
          );
          sessionStorage.setItem(
            "accessToken",
            authenticationResult?.AccessToken || "",
          );
          setToken(authenticationResult?.AccessToken || "");

          // alert("User logged in successfully!");
          if(!!sessionStorage.getItem("accessToken")){
            console.log("Navigated to home")
            //Needed for session storage refresh (dont change to navigate)
            window.location.href = "/home";
          }
        }
        
      } catch (error) {
        alert("Error logging in: " + error);
      }
    })();
  };


  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
      <Paper variant="elevation" sx={{ px: 3, borderRadius: '10%', height: 'fit-content', width: 'fit-content', pt: 1, pb: 3 }}>
        <Typography variant="h3" textAlign="start" style={{ fontFamily: "Roboto, sans-serif" }} mt={1} className="theme-title-text">
          Login
        </Typography>
        <Box component="form" width={'fit-content'}>
          <FormContainer formContext={form}>
            <Stack width={'400px'} mt={2} gap={1}>
              <TextFieldElement
                name="email"
                // margin="normal"
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextFieldElement
                name="password"
                // margin="normal"
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
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
          </FormContainer>

          <Typography sx={{ textAlign: 'center' }}>
            Don't have an account?{" "}
            <Link href="#" variant="body2" onClick={() => navigate("/signup")}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
      </Box>
  );
}
