import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import CoinIcon from "../../images/aeither_coin.png";
import GloriousButton from "../../components/ui/GloriousButton";
import fireConfetti from "../../components/custom-fire-confetti";
import { apiClient } from "../../components/utils/ApIClient";
import { claimDailyTask } from "../../components/methods";

const DailyTaskRow = ({ tasks, updateBalance }) => {
  const [claimed, setClaimed] = useState(false);

  const getLabel = (index) => {
    if (tasks.length === 3) {
      return ["Yesterday", "Today", "Tomorrow"][index].toUpperCase();
    } else {
      return ["Today", "Tomorrow"][index].toUpperCase();
    }
  };

  const handleClaim = async (reward) => {
    const response = await apiClient(claimDailyTask, { method: "POST" });
    console.log("Claim response:", response);

    if (response.status !== "success") {
      alert("Failed to claim reward");
      return;
    }

    alert(`Claimed ${reward} coins`);
    updateBalance(reward);
    setClaimed(true);
    fireConfetti();
  };

  useEffect(() => {
    tasks.forEach((task) => {
      if (task.status === "C") {
        setClaimed(true);
      }
    });
  }, [tasks]);

  return (
    <Box mb={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="#fff">
        🧧 Claim Daily
      </Typography>
      <Grid container spacing={2} justifyContent="center" >
        {tasks.map((task, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                height: "100%",
                transition: "0.3s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                {/* Coin Icon */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <img
                    src={CoinIcon}
                    alt="Coin"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  />
                </Box>

                {/* Labels */}
                <Typography variant="subtitle2" color="text.secondary">
                  {getLabel(idx)}
                </Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                  🔥 Hot Streak: <b>{task.streak}</b>
                </Typography>

                {/* Reward */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#f59e0b" }}
                >
                  {task.reward} Coins
                </Typography>

                {/* Claim Button */}
                {getLabel(idx) === "TODAY" && task.status !== "N" && (
                  <Box sx={{ mt: 2 }}>
                    <GloriousButton
                      onClick={!claimed ? () => handleClaim(task.reward) : null}
                      color="green"
                      text={claimed ? "Claimed" : "Claim"}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DailyTaskRow;
