import { Box, Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { use, useEffect, useState } from "react";
import fireConfetti from "../../components/custom-fire-confetti";
import CoinIcon from '../../images/aeither_coin.png';
import { Ribbon } from "lucide-react";
import GloriousButton from "../../components/ui/GloriousButton";
import { apiClient } from "../../components/ApIClient";
import { claimDailyTask } from "../../components/methods";

const DailyTaskRow = ({ tasks, updateBalance }) => {
  const [claimed, setClaimed] = useState(false);

  const getLabel = (index) => {
    if (tasks.length === 3) {
      return ["Yesterday", "Today", "Tomorrow"][index].toUpperCase();
    } else {
      return ["Today", "Tomorrow"][index].toUpperCase(); // Skip Yesterday if only 2
    }
  };

  const handleClaim = async (reward) => {
    const response = await apiClient(claimDailyTask, {
      method: 'POST',
    });
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
    <Grid container spacing={2} justifyContent="center">
      {tasks.map((task, idx) => (
        <Grid item xs={12} sm={4} key={idx}>
          <Card variant="outlined">
            <CardContent style={{ textAlign: "center" }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                <img
                  src={CoinIcon}
                  alt="Coin"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                  }}
                />
              </Box>
              <Typography variant="h6">{getLabel(idx)}</Typography>
              <Typography variant="body2">🔥 Hot Streak: {task.streak}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {task.reward} Coins
              </Typography>
              {getLabel(idx) === "TODAY" && task.status !== "N" ? (
                <Box sx={{ mt: 2 }}>
                  <GloriousButton
                  onClick={!claimed ? () => handleClaim(task.reward) : null}
                  color="green"
                  text={claimed ? "Claimed" : "Claim"}
                />
                </Box>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DailyTaskRow;
