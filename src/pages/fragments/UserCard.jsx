import { Card, CardContent, Typography, Box, Button, Tooltip } from "@mui/material";
import { Google } from "@mui/icons-material";

export default function UserCard({ user, isTop10, upgradeGuestAccount }) {
  return (
    <Card
      sx={{
        width: 320,
        borderRadius: "20px",
        background: "linear-gradient(135deg, #1e293b, #0f172a)",
        color: "white",
        boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        p: 2,
      }}
    >
      <CardContent>
        {/* User Info */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {user.firstName || "Guest"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5, color: "#cbd5e1" }}>
          {user.email || "guest@example.com"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 0.5, color: "#cbd5e1" }}>
          {user.mobile || "+91 XXXXX XXXXX"}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "#cbd5e1" }}>
          UID: {user.referralCode || "N/A"}
        </Typography>

        {/* Buttons */}
        {user.annonymous ? (
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#3b82f6",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
              mb: 2,
              "&:hover": { bgcolor: "#2563eb" },
            }}
            onClick={upgradeGuestAccount}
          >
            <Google sx={{ mr: 1 }} /> Connect Google
          </Button>
        ) : isTop10 ? (
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#22c55e",
              borderRadius: "30px",
              textTransform: "none",
              fontWeight: 600,
              py: 1.2,
              mb: 2,
              "&:hover": { bgcolor: "#16a34a" },
            }}
            onClick={() => alert("Withdraw triggered!")}
          >
            Claim Reward
          </Button>
        ) : (
          <Tooltip title="Your rank must be in the Top 10 today to withdraw">
            <span style={{ width: "100%" }}>
              <Button
                fullWidth
                disabled
                variant="contained"
                sx={{
                  bgcolor: "#9ca3af",
                  borderRadius: "30px",
                  textTransform: "none",
                  fontWeight: 600,
                  py: 1.2,
                  mb: 2,
                }}
              >
                Claim Locked
              </Button>
            </span>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );
}
