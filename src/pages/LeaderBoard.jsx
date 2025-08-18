import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from "@mui/material";
import CommonHeader from "../components/ui/CommonHeader";

const leaderboardData = {
  daily: [
    { rank: 1, name: "Albert Einstein", score: 160, avatar: "/einstein.png" },
    { rank: 2, name: "Adam Nielsen", score: 83, avatar: "/adam.png" },
    { rank: 3, name: "Nikola Tesla", score: 56, avatar: "/tesla.png" },
    { rank: 4, name: "David Bowie", score: 47, avatar: "/bowie.png" },
    { rank: 5, name: "Audrey Hepburn", score: 29, avatar: "/audrey.png" },
    { rank: 6, name: "Ella Fitzgerald", score: 17, avatar: "/ella.png" },
  ],
  weekly: [
    { rank: 1, name: "Nikola Tesla", score: 220, avatar: "/tesla.png" },
    { rank: 2, name: "Albert Einstein", score: 190, avatar: "/einstein.png" },
    { rank: 3, name: "Adam Nielsen", score: 150, avatar: "/adam.png" },
  ],
  monthly: [
    { rank: 1, name: "David Bowie", score: 520, avatar: "/bowie.png" },
    { rank: 2, name: "Audrey Hepburn", score: 480, avatar: "/audrey.png" },
    { rank: 3, name: "Ella Fitzgerald", score: 430, avatar: "/ella.png" },
  ],
};

const rankColors = {
  1: "#FFD700", // Gold
  2: "#C0C0C0", // Silver
  3: "#CD7F32", // Bronze
};

export default function Leaderboard() {
  const [tab, setTab] = useState("daily");

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "rgba(0,0,0,0.6)",
        }}
      >
        <CommonHeader/>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            bgcolor: "#FFD700",
            color: "#000",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            🏆 Leaderboard
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          centered
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: "#FFD700" } }}
          sx={{
            "& .MuiTab-root": {
              color: "#B8C6A6",
              fontWeight: "bold",
            },
            "& .Mui-selected": {
              color: "#FFD700 !important",
            },
          }}
        >
          <Tab value="daily" label="Daily" />
          <Tab value="weekly" label="Weekly" />
          <Tab value="monthly" label="Monthly" />
        </Tabs>

        {/* Leaderboard List */}
        {false ? (
        <List sx={{ bgcolor: "transparent" }}>
          {leaderboardData[tab].map((player, index) => (
            <React.Fragment key={player.rank}>
              <ListItem
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  "&:hover": {
                    bgcolor: "rgba(255,215,0,0.15)",
                  },
                  borderLeft: `6px solid ${
                    rankColors[player.rank] || "transparent"
                  }`,
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    width: 30,
                    textAlign: "center",
                    color: rankColors[player.rank] || "#FFF",
                    fontWeight: "bold",
                  }}
                >
                  {player.rank}
                </Typography>
                <ListItemAvatar>
                  <Avatar src={player.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography sx={{ color: "#FFF", fontWeight: "bold" }}>
                      {player.name}
                    </Typography>
                  }
                />
                <Typography
                  variant="body1"
                  sx={{ color: "#FFD700", fontWeight: "bold" }}
                >
                  {player.score}
                </Typography>
              </ListItem>
              {index < leaderboardData[tab].length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        ) : (
          <Box sx={{ p: 2, textAlign: "center", color: "#B8C6A6" }}>
            <Typography variant="body1">
                Leaderboard data is currently unavailable. Please check back later after trail run finishes.
            </Typography>
          </Box>
        )}

        {/* Footer */}
      </Paper>
    </Box>
  );
}
