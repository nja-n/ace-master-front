import { Box, Link, Typography } from "@mui/material";
import bgGreenTable from "../../images/bg-home.png";
import { protocol, server } from "../serverURL";
import InstallPrompt from "../force/Promote";
import { useLocation } from "react-router-dom";
import { Header } from "../../pages/fragments/Header";
import useLocalStorage from "../utils/UseLocalStorage";

const LayoutWithBackground = ({ children, version }) => {
  const location = useLocation();

  const isGameRoute 
    = location.pathname === "/" 
    || location.pathname.startsWith("/game")
    || location.pathname.startsWith("/play");

  return (
    <Box
      sx={{
        backgroundColor: "#2e7d32", // fallback color
        backgroundImage: `url(${bgGreenTable})`,
        backgroundSize: "cover",   // instead of "contain"
        backgroundPosition: "top", // center the image
        backgroundRepeat: "no-repeat", // no tiling
        position: "relative",
        minHeight: "100vh", // better than fixed height
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        //justifyContent: "space-between",
      }}

    >
      {!isGameRoute && <Header/>}
      {children}
      <Box
        sx={{
          position: "fixed",
          bottom: 10,
          right: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "white", opacity: 0.7 }}
        >
          © 2025 {" "}
          <Link
            href={`${protocol}://${server}`}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ color: "#FFD700", fontWeight: "bold" }} // gold highlight for link
          >
            Aeither
          </Link>{" "} Dev Team | Trail - v{version}
        </Typography>
      </Box>
      <InstallPrompt />
      {/* <Box
        sx={{
          position: "fixed",
          bottom: 10,
          left: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "white", opacity: 0.7 }}
        >
          <Link
            href='terms'
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
          Terms
          </Link>
          {" & "}
          <Link
            href='privacy'
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
          >
          Privacy Policy
          </Link>
        </Typography>
      </Box> */}
    </Box>
  );
};

export default LayoutWithBackground;
