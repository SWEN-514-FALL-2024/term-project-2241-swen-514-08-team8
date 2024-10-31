// SignUp.tsx
import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { signUpUser } from "./auth";

export function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await signUpUser(username, password);
      alert("User signed up successfully!");
    } catch (error) {
      alert("Error signing up: " + error);
    }
  };

  return (
    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleSignUp} fullWidth>
        Sign Up
      </Button>
    </Box>
  );
}
