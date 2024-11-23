// SignUp.tsx
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Link, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import '../../text-gradient.css';
import { authConfig } from "../authConfgure";

const cognitoClient = new CognitoIdentityProviderClient({ region: authConfig.Region });

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const form = useForm({ 
    resolver: zodResolver(z.object({
      email: z.string().email(),
      password: z.string().min(1, "Password is required"),
    })),
  })

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
    form.handleSubmit(async () => {
      try {
        await signUpUser(email, password);
        alert("User signed up successfully!");
        navigate("/confirm");
      } catch (error) {
        alert("Error signing up: " + error);
      }
    })();
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="90vh">
      <Paper variant="elevation" sx={{ px: 3, borderRadius: '10%', height: 'fit-content', width: 'fit-content', pt: 1, pb: 3 }}>
        <Typography variant="h3" textAlign="start" style={{ fontFamily: "Roboto, sans-serif" }} mt={1} className="theme-title-text">
          Signup
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
              onClick={handleSignUp}
              sx={{ mt: 3, mb: 2 }}
            >
              Signup
            </Button>
            </FormContainer>

          <Typography sx={{ textAlign: 'center' }}>
          Already have an account?
          <Link href="#" variant="body2" onClick={() => navigate("/")}>
            {"Log In"}
          </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default SignUp;
