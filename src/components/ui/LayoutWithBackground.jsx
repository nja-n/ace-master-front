import React from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import bgGreenTable from "../../images/bg-home.png";
import { protocol, server } from "../serverURL";

const LayoutWithBackground = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#2e7d32",
        backgroundImage: `url(${bgGreenTable})`,
        backgroundSize: "contain",
        backgroundPosition: "top",
        position: "relative",
        //backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {children}
      <Box
        sx={{
          position: "fixed",
          bottom: 10,
          right: 15,
          display: "flex",
          alignItems: "center",
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
          </Link>{" "} Dev Team | Trail - v0.0.1
        </Typography>
      </Box>
    </Box>
  );
};

export default LayoutWithBackground;
