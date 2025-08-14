import React from "react";
import { Box, Container } from "@mui/material";
import bgGreenTable from "../../images/bg-home.png";

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
    </Box>
  );
};

export default LayoutWithBackground;
