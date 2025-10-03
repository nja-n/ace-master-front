import { Box, Link, Typography } from "@mui/material";
import bgGreenTable from "../../images/bg-home.png";
import { protocol, server } from "../serverURL";
import InstallPrompt from "../force/need/Promote";
import { useLocation } from "react-router-dom";
import { Header } from "../../pages/fragments/Header";
import useLocalStorage from "../utils/UseLocalStorage";

const LayoutWithBackground = ({ children, version }) => {
  const location = useLocation();

  const isGameRoute 
    = /*location.pathname === "/" 
    ||*/ location.pathname.startsWith("/game")
    || location.pathname.startsWith("/play");

  return (
    <Box
  sx={{
    backgroundColor: "#2e7d32",
    backgroundImage: `url(${bgGreenTable})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    minHeight: "100dvh", // dynamic viewport height for mobile correctness
    display: "flex",
    flexDirection: "column",
  }}
>
  {/* Header (only if not in game) */}
  {!isGameRoute && <Header />}

  {/* Main content fills remaining space */}
  <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
    {children}
  </Box>

  {/* Footer (fixed bottom inside layout, not absolute) */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      py: 1,
    }}
  >
    <Typography
      variant="caption"
      sx={{ color: "white", opacity: 0.7 }}
    >
      © 2025{" "}
      <Link
        href={`${protocol}://${server}`}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        sx={{ color: "#FFD700", fontWeight: "bold" }}
      >
        Aeither
      </Link>{" "}
      Dev Team | Trail - v{version}
    </Typography>
  </Box>

  <InstallPrompt />
</Box>

  );
};

export default LayoutWithBackground;
