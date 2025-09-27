import { Close, Google, PhotoCamera } from "@mui/icons-material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Avatar, Box, Button, Card, Dialog, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { useLoading } from "../components/LoadingContext";
import { fetchAchievements, gConnect } from "../components/methods";
import CustomAvatar from "../components/ui/CustomAvathar";
import { useUser } from "../components/ui/UserContext";
import { apiClient } from "../components/utils/ApIClient";
import { auth, googleProvider } from "../firebase-config";
import CoinIcon from '../images/aeither_coin.png';
import GloriousButton from "../components/ui/GloriousButton";
import { orange } from "@mui/material/colors";
import { LedgerDialog } from "./fragments/LedgerDialog";
import UserCard from "./fragments/UserCard";

export default function ProfilePage({ isTop10 }) {
  const { user, loading } = useUser();
  const { setLoading } = useLoading();
  const [profile, setProfile] = useState(null);

  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const [gameLedger, setGameLedger] = useState(false);
  const [coinLedger, setCoinLedger] = useState(false);

  const [avatar, setAvatar] = useState(null);

  const statIdeas = {
    dayStreak: {
      title: "Day Streak",
      value: 1,
      description: "Number of consecutive days you played.",
    },
    league: {
      title: "League",
      value: "BRONZE",
      description: "Your league tier based on Wins (Bronze → Silver → Gold).",
    },
    winStreak: {
      title: "Win Streak",
      value: 3,
      description: "Number of games won in a row.",
    },
    gamesPlayed: {
      title: "Games Played",
      value: 3,
      description: "Total matches completed (Wins + Draws + Losses).",
    },
    winRate: {
      title: "Win Rate",
      value: "33%",
      description: "Calculated as Wins ÷ Games Played × 100.",
    },
    rank: {
      title: "Rank",
      value: "Unranked",
      description: "Your position compared to other players.",
    },
  };


  useEffect(() => {
    if (user === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [user, setLoading]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await apiClient(fetchAchievements, { userId: user.id });
        setProfile(response);

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    if (user && user.id) {
      fetchProfile();
    }
  }, [user]);
  //isTop10 = isTop10 || true;

  if (user === null || profile === null) {
    setLoading(true);
    return
  } else {
    setLoading(false);
  }

  async function upgradeGuestAccount() {
    // const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await linkWithPopup(auth.currentUser, googleProvider);

      // Get the fresh token (contains updated Firebase claims)
      const idToken = await result.user.getIdToken(true);

      // Send it to your backend to trigger the upgrade logic
      const res = await apiClient(gConnect, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: idToken }),
        refreshOnSuccess : true
      });
      alert("Successfully Connected.")

    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpen = (key) => {
    setSelectedKey(key);
    alert(statIdeas[key].description);
    //setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedKey(null);
  };

  const handleAvatarUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  }
};


  return (
    <Box sx={{ mt: { xs: 3, md: 5 }, px: { xs: 2, md: 5 }, overflowX: "hidden" }}>
      <Grid container >
        {/* LEFT SECTION (Profile Info & Stats) */}
        <Grid>
          {/* Profile Header */}
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center", gap: 2,
                border: "2px dashed rgba(0,0,0,0.2)", 
                borderRadius: "20px",
                p:2,
                boxShadow:"0 2px 4px rgba(0,0,0,0.6)"
            }}>
              {/* <Box sx={{ position: "relative", display: "inline-block", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2 }}> */}
              <CustomAvatar
                size={200}
                letter={(user.firstName || "?")?.charAt(0).toUpperCase()}
                settings={true}
                user={user}
              />
              <UserCard isTop10={false} 
                upgradeGuestAccount={upgradeGuestAccount}
                user={user}/>
            </Box> 
            <Box display={"flex"}
                  flexDirection={"row"}
                  justifyContent="space-between"
                  gap={1} width="100%">
                  <GloriousButton
                    color={"green"}
                    onClick={() => setGameLedger(true)}
                    text="Last Games"
                    sx={{width:"100%"}}
                  />
                  <GloriousButton
                    color={"green"}
                    onClick={() => setCoinLedger(true)}
                    text="Coin History"
                    sx={{width:"100%"}}
                  />
                </Box>

            <Typography variant="body2" color="gray">Level {profile.level || 1}</Typography>
            <Box sx={{ width: { xs: '80%', sm: '60%' }, mt: 1 }}>
              <LinearProgress variant="determinate" value={profile.xpPercent || 0} sx={{ height: 8, borderRadius: 5, bgcolor: "#334155" }} />
            </Box>
          </Stack>

          {/* Stats Row */}
          <Grid container spacing={2} mb={2}>
            {[
              { icon: <FlashOnIcon sx={{ color: "#facc15", fontSize: 32 }} />, label: "Day Streak", value: profile.dayStreak || 0, key: "dayStreak" },
              { icon: <EmojiEventsIcon sx={{ color: "#fbbf24", fontSize: 32 }} />, label: "League", value: (profile.league || "Bronze").toUpperCase(), key: "league" },
              { icon: <img src={CoinIcon} alt="Coin" style={{ width: 28, height: 28 }} />, label: "Win Streak", value: profile.currentStreak || 0, key: "winStreak" }
            ].map((stat, idx) => (
              <Grid item xs={4} sm={4} key={idx}>
                <Card sx={{ p: 2, background: "linear-gradient(135deg,#1e293b,#334155)", textAlign: "center", borderRadius: 3, boxShadow: 4, cursor: "pointer" }} onClick={() => handleOpen(stat.key)}>
                  <Box display="flex" justifyContent="center">{stat.icon}</Box>
                  <Typography variant="body2" color="#fff">{stat.label}</Typography>
                  <Typography variant="h6" color="#fbbf24">{stat.value}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Extra Stats */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: "Games Played", value: profile.count || 0, key: "gamesPlayed" },
              { label: "Win Rate", value: profile.winRate?.toFixed(2) || 0, key: "winRate" },
              { label: "Rank", value: profile.rank || "Unranked", key: "rank" }
            ].map((stat, idx) => (
              <Grid item xs={4} sm={4} key={idx}>
                <Card sx={{ p: 2, bgcolor: "#1e293b", textAlign: "center", cursor: "pointer" }} onClick={() => handleOpen(stat.key)}>
                  <Typography variant="body2" color="gray">{stat.label}</Typography>
                  <Typography variant="h6" color="white">{stat.value}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          {(gameLedger || coinLedger) &&
            <LedgerDialog setOpenGame={setGameLedger} user = {user.id}
              setOpenCoin={setCoinLedger} view={gameLedger ? "game" : "coin"} />}

          {/* For small screens, badges */}
          {/* <Box sx={{ display: { xs: "block", md: "none" } }}>
            <BadgesAndAchievements />
          </Box> */}
        </Grid>

        {/* RIGHT SECTION (Badges for big screens) */}
        {/* <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <BadgesAndAchievements />
        </Grid> */}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        {selectedKey && (
          <>
            <DialogTitle>
              {statIdeas[selectedKey].title}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{ position: "absolute", right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography>{statIdeas[selectedKey].description}</Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );

}

function BadgesAndAchievements() {
  return (
    <>
      {/* Badges */}
      <Typography variant="h6" sx={{ mb: 1 }} color="white">Badges</Typography>
      <Typography variant="body2" color="gray" sx={{ mb: 3 }}>
        Coming soon...
      </Typography>

      {/* Achievements */}
      <Typography variant="h6" sx={{ mb: 1 }} color="white">Achievements</Typography>
      <Typography variant="body2" color="gray">
        Coming soon...
      </Typography>
    </>
  );
}
