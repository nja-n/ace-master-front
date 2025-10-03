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
// import { Helmet } from "react-helmet-async";

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
        minHeight: "100vh",
        padding: 4,
        color: "#eee",
        background: "linear-gradient(135deg, #1e293b65, #33415565)",
        overflowY: "auto",
      }}
    >
      {/* Title */}
      {/* <Helmet>
        <title>About AceMaster</title>
        <meta name="description" content="Learn about AceMaster, the multiplayer card and puzzle game that combines fun and strategy." />
        <meta name="robots" content="index, follow" />
      </Helmet> */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item>
                    <GloriousButton text="Contact Us" color="darkblue" onClick={() => navigate("/contact")}/>

        </Grid>
        <Grid item>
                    <GloriousButton text="Terms & Conditions" onClick={() => window.open("/terms", "_blank")}
              color="darkblue"/>

        </Grid>
      </Grid>
      <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
        🃏 Kazhutha – Multiplayer Card Game
      </Typography>
      <Typography variant="h5" align="center" sx={{ maxWidth: 800, mx: "auto", mb: 4 }}>
        Ace Master is an exhilarating card game inspired by the traditional <strong>Kazhutha (കഴുത || கழுதை)</strong> from South India.
        Outthink your rivals and get rid of your cards before anyone else!
      </Typography>

      {/* Game Overview */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🎮 How to Play
        </Typography>
        <Typography paragraph>
          The main objective is to clear your hand of all cards as quickly as possible.
        </Typography>
        <Typography paragraph>
          Each round has an active suit (♣, ♦, ♥, ♠). Play cards in sequence. If you don’t have one, perform a <b>Strike (break the suit/flow)</b> – play another suit.
          In this case, the player with the highest card takes the pile.
        </Typography>
        <Typography paragraph>
          Player with the highest card of a round chooses the next suit. The last player holding cards at the end is the
          <b> Kazhutha (Donkey) 🐴</b>.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          🔢 Card Power
        </Typography>
        <Typography paragraph>2–10 = low to high | J=11th, Q=12th, K=13th, A=14th</Typography>
      </Paper>

      {/* Mobile Version */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          📱 Game Categories
        </Typography>
        <Typography paragraph>
          Choose from 4 categories – <b>Online</b> and <b>Quick</b> with unique bet ranges. <b>AI</b>, and <b>Room</b> are non betting. {/*– each with*/}
        </Typography>
        <Typography paragraph>
          Online and Rooms have 3–6 seats. Join by tapping an empty chair. Invite friends via shareable link or play with bots if fewer players join.
        </Typography>
      </Paper>

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

      {/* Unique Features */}
      <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
        🌟 Unique Experience with Ace Master
      </Typography>
      <Typography align="center" sx={{ maxWidth: 700, mx: "auto", mb: 3 }}>
        Dive into immersive gameplay, intuitive controls, and addictive challenges that keep you coming back for more!
      </Typography>

      <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">🎬 Game Direction</Typography>
            <Typography variant="body2">Strategize every move and outplay opponents.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">📽️ Game Mechanics</Typography>
            <Typography variant="body2">Smooth and competitive gameplay.</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" fontWeight="bold">🎯 Visual Effects</Typography>
            <Typography variant="body2">Engaging visuals & animations for epic battles.</Typography>
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
                  🗓️ {entry.date.split('T')[0]} - 🔹 {entry.version}
                  <Typography variant="subtitle2">{entry.head}</Typography>
                </Paper>
              ))
            ) : (
              <Typography>No version history available.</Typography>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default About;
