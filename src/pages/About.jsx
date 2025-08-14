import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { versionHistory } from "../components/methods";
import { formatDate } from "../components/Utiliy";
import GloriousButton from "../components/ui/GloriousButton";
import AceMasterLogo from "../components/ui/GameLogoHeader";

const About = () => {
  const navigate = useNavigate();
  const [version, setVersion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({ users: 1340, online: 76 });

  useEffect(() => {
    const fetchVersionHistory = async () => {
      try {
        const response = await fetch(versionHistory);
        if (!response.ok) throw new Error("Failed to fetch version history");

        const data = await response.json();
        setVersion(data.currentVersion);
        setHistory(data.history);
        setStats(data.stats || { users: 0, online: 0 });
      } catch (error) {
        console.error("Error fetching version history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersionHistory();
  }, []);

  return (
    <Box
      sx={{
        //backgroundImage: `url(${bgGreenTable})`,
        //backgroundSize: "cover",
        minHeight: "100vh",
        padding: 4,
        color: "#eee",
        overflowY: "auto",
      }}
    >
      <Box align="center">
        <AceMasterLogo />
      </Box>
      {/* Header */}
      <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
        ABOUT US
      </Typography>
      <Typography variant="h6" align="center" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        Ace Master is an exhilarating card game that challenges your strategic thinking and lightning-fast decision-making! Inspired by the classic Kazhutha game from Kerala.
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={4} sx={{ p: 3, textAlign: "center", backgroundColor: "#f0f4c3" }}>
            <Typography variant="h4" fontWeight="bold">{stats.users}</Typography>
            <Typography>Total Users</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={4} sx={{ p: 3, textAlign: "center", backgroundColor: "#b2dfdb" }}>
            <Typography variant="h4" fontWeight="bold">{stats.online}</Typography>
            <Typography>Currently Online</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Services Section */}
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        UNIQUE EXPERIENCE WITH ACE MASTER
      </Typography>
      <Typography align="center" sx={{ maxWidth: 700, mx: "auto", mb: 3 }}>
        Dive into immersive gameplay, intuitive controls, and addictive challenges that keep you coming back for more!
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">🎬 Game Direction</Typography>
            <Typography variant="body2">
              Strategize every move and outplay your opponents with skill.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">📽️ Game Mechanics</Typography>
            <Typography variant="body2">
              Smooth gameplay and competitive features for all games.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">🎯 Visual Effects</Typography>
            <Typography variant="body2">
              Engaging visuals and animations for an epic card battle experience.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Version Info */}
      <Paper elevation={2} sx={{ p: 3, maxWidth: 800, mx: "auto", mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Version Information
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <Typography variant="body1">
              🔹 Current Version: <strong>{version}</strong>
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Version History
            </Typography>
            {history.length > 0 ? (
              history.map((entry, index) => (
                <Paper key={index} sx={{ p: 1, my: 1 }}>
                  🗓️ {formatDate(entry.date)} - 🔹 {entry.version}
                  <Typography variant="subtitle2">{entry.head}</Typography>
                </Paper>
              ))
            ) : (
              <Typography>No version history available.</Typography>
            )}
          </>
        )}
      </Paper>

      {/* Buttons */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
          <GloriousButton text="Contact Us" color="darkblue" onClick={() => navigate("/contact")}>
            Contact Us
          </GloriousButton>
        </Grid>
        <Grid item>
          <GloriousButton text="Terms & Conditions" onClick={() => window.open("/terms", "_blank")}
              color="darkblue">
            Terms & Conditions
          </GloriousButton>
        </Grid>
        <Grid item>
          <Button variant="text" onClick={() => navigate(-1)}>
            ⬅ Back to Home
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
