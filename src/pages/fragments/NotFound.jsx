import { Container, Typography, Box } from "@mui/material";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";

export default function NotFound() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 12,
        textAlign: "center",
        color: "white", // make text white
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <ReportProblemOutlinedIcon sx={{ fontSize: 80, color: "#ffcc00" }} />
      </Box>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        404 - Page Not Found
      </Typography>

      <Typography variant="body1" sx={{ opacity: 0.8 }}>
        Oops! The page you are looking for doesn’t exist.
      </Typography>
    </Container>
  );
}
