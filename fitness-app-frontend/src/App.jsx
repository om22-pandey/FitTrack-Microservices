import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton
} from "@mui/material";
import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,Navigate,
  Route,
  Routes,
} from "react-router"; // ध्यान दें: अगर 'react-router-dom' यूज़ कर रहे हैं तो वहां से इम्पोर्ट करें
import { setCredentials } from "./store/authSlice";
import { Brightness4, Brightness7 } from "@mui/icons-material";

import ActivityDetail from "./components/ActivityDetail";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";

function AppContent() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();
  
  // Theme state switcher
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("themeMode") || "dark";
  });

  useEffect(() => {
    if (token) {
      dispatch(
        setCredentials({
          token,
          user: tokenData,
        })
      );
    }
  }, [token, tokenData, dispatch]);

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#3b82f6" : "#1565C0",
          },
          background: {
            default: mode === "dark" ? "#0f172a" : "#f8fafc",
            paper: mode === "dark" ? "#1e293b" : "#ffffff",
          },
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        },
      }),
    [mode]
  );

  // जब तक टोकन चेक हो रहा है और URL में '?code=' मौजूद है, तब तक लोडिंग दिखाएं ताकि राउटर बीच में दखल न दे
  // const hasCodeInUrl = window.location.search.includes("code=");
  // if (!token && hasCodeInUrl) {
  //   return (
  //     <ThemeProvider theme={theme}>
  //       <CssBaseline />
  //       <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "background.default" }}>
  //         <Typography variant="h6">Authenticating with Keycloak...</Typography>
  //       </Box>
  //     </ThemeProvider>
  //   );
  // }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!token ? (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: mode === "dark" 
              ? "linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)"
              : "linear-gradient(135deg, #eff6ff, #dbeafe, #eff6ff)",
            position: "relative"
          }}
        >
          <Box sx={{ position: "absolute", top: 20, right: 20 }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>

          <Paper
            elevation={6}
            sx={{
              p: 5,
              width: 420,
              borderRadius: 4,
              textAlign: "center",
              backdropFilter: "blur(10px)",
              background: mode === "dark" ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.9)",
              border: mode === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
            }}
          >
            <Typography sx={{ fontSize: 65, mb: 1 }}>🏋️</Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Fitness Tracker
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Track workouts, monitor calories and stay healthy.
            </Typography>
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => logIn()}
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.4)"
              }}
            >
              Login with Keycloak
            </Button>
          </Paper>
        </Box>
      ) : (
        <>
          <Navbar onLogout={logOut} currentMode={mode} toggleTheme={toggleTheme} />
          <Container maxWidth="lg" sx={{ py: 5 }}>
            <Routes>
              <Route path="/activities" element={<Dashboard />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/" element={<Navigate to="/activities" replace />} />
            </Routes>
          </Container>
        </>
      )}
    </ThemeProvider>
  );
}

// मुख्य App कंपोनेंट जो Router को सबसे बाहर रखता है
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;