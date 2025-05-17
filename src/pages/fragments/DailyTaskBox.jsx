import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Button, Grid } from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import fireConfetti from "../../components/custom-fire-confetti";

const getCoinsForDay = (day) => {
  const coinMap = [0, 100, 130, 180, 210, 240, 270];
  return day <= 7 ? coinMap[day] : 300;
};

const DailyTaskRow = ({ currentDay }) => {
  const days = [
    { label: "Yesterday", day: currentDay - 1 },
    { label: "Today", day: currentDay },
    { label: "Tomorrow", day: currentDay + 1 },
  ];

  const [claimed, setClaimed] = useState(false);



  const handleClaim = () => {
    // Call API to save claim
    setClaimed(true);
    fireConfetti();

    
    alert(`Claimed ${getCoinsForDay(currentDay)} coins`);
  };

  return (
    <Grid container spacing={2} justifyContent="center">
      {days.map((d, idx) => (
        <Grid item xs={12} sm={4} key={idx}>
          <Card variant="outlined">
            <CardContent style={{ textAlign: "center" }}>
              <MonetizationOnIcon fontSize="large" color="primary" />
              <Typography variant="h6">{d.label}</Typography>
              <Typography variant="body2">Day {d.day}</Typography>
              <Typography variant="body1" fontWeight="bold">
                {getCoinsForDay(d.day)} Coins
              </Typography>
              {d.label === "Today" ? (
                <Button
                  onClick={handleClaim}
                  disabled={claimed}
                  variant="contained"
                  sx={{ marginTop: 1 }}
                >
                  {claimed ? "Claimed" : "Claim"}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DailyTaskRow;
