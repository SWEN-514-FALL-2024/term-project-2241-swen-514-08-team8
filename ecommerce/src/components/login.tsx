// Login.tsx
import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { loginUser } from "./auth";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser(username, password);
      alert("User logged in successfully!");
    } catch (error) {
      alert("Error logging in: " + error);
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
      <Button variant="contained" color="primary" onClick={handleLogin} fullWidth>
        Login
      </Button>
    </Box>
  );
}
