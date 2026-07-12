import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const Navbar = ({ onLogout, currentMode, toggleTheme }) => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: currentMode === "dark" ? "#1e293b" : "#1565C0",
        borderBottom: currentMode === "dark" ? "1px solid rgba(255,255,255,0.08)" : "none",
      }}
    >
      <Toolbar>
        <Typography sx={{ fontSize: 28, mr: 2 }}>🏋️</Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 0.5 }}>
            Fitness Tracker
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Track • Improve • Repeat
          </Typography>
        </Box>

        <IconButton onClick={toggleTheme} color="inherit" sx={{ mr: 2 }}>
          {currentMode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <Button
          color="inherit"
          variant="outlined"
          sx={{
            borderRadius: 2,
            textTransform: "none",
            color: "white",
            borderColor: "rgba(255,255,255,0.5)",
            "&:hover": {
              borderColor: "white",
              background: "rgba(255,255,255,0.08)"
            },
          }}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;