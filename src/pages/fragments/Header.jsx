import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import AceMasterLogo from "../../components/ui/GameLogoHeader";
import CoinWithText from "./CoinWithText";
import { ArrowBack, Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/ui/UserContext";
export const Header = (color) => {
  const navigate = useNavigate();
  const {user} = useUser();
  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, rgba(30,41,59,0.55), rgba(51,65,85,0.55))",
        boxShadow: 3,
        borderRadius: 2,
        color: "gold",
        // px: 0, // proper padding instead of margin
      }}
    >
      <Toolbar sx={{ 
          display: "flex", justifyContent: "space-between",
          marginLeft: '8px', marginRight: '8px',
         }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          <ArrowBack />
        </IconButton>
        {/* Left side: Logo */}
        <AceMasterLogo />

        {/* Right side: Balance + Nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CoinWithText coinBalance={user && user.coinBalance} />
          <Home onClick={() => navigate("/")} style={{ cursor: "pointer" }} />
        </Box>
      </Toolbar>
    </AppBar>
  )
}