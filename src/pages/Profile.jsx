import { Close, Google } from "@mui/icons-material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, LinearProgress, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { useLoading } from "../components/LoadingContext";
import CustomAvatar from "../components/ui/CustomAvathar";
import { useUser } from "../components/ui/UserContext";
import { auth } from "../firebase-config";
import CoinIcon from '../images/aeither_coin.png';
import { useEffect, useState } from "react";
import { apiClient } from "../components/utils/ApIClient";
import { fetchAchievements, saveUser } from "../components/methods";
import { getDeviceInfo } from "../components/Utiliy";

export default function ProfilePage({ isTop10 }) {
    const { user, loading } = useUser();
    const { setLoading } = useLoading();
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [changedName, setChangedName] = useState(user?.firstName || "");

    const [open, setOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);

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
        return (
            <Box sx={{ p: 2, textAlign: "center", color: "#fff" }}>
                Loading...
            </Box>
        );
    }

    async function upgradeGuestAccount() {
        const provider = new GoogleAuthProvider();
        try {
            const result = await linkWithPopup(auth.currentUser, provider);

            // Get the fresh token (contains updated Firebase claims)
            const idToken = await result.user.getIdToken(true);

            // Send it to your backend to trigger the upgrade logic
            const res = await fetch("/api/upgrade-guest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                }
            });

            if (res.ok) {
                const updatedUser = await res.json();
                console.log("Backend confirms upgrade:", updatedUser);
            } else {
                console.error("Backend upgrade failed");
            }

        } catch (error) {
            console.error("Upgrade failed:", error);
        }
    }

    const handleSave = async () => {
        if (changedName.trim()) {
            setLoading(true);
            const deviceInfo = await getDeviceInfo();
            try {
                const payload = {
                    id : user.id,
                    firstName: changedName,
                    os: deviceInfo.platform,
                    platform: deviceInfo.userAgent,
                    screenWidth: deviceInfo.screenWidth,
                    screenHeight: deviceInfo.screenHeight
                };

                const response = await apiClient(saveUser, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: payload,
                    refreshOnSuccess: true,
                });

                if (!response) throw new Error("Failed to save user");

                const data = await response;

                alert('Player Name have been saved.');

            } catch (error) {
                alert('something went wrong, please try again');
                console.error("Error saving user:", error);
                setLoading(false);
            }
            setLoading(false);
        }
        setIsEditing(false);
    };
    const handleOpen = (key) => {
        setSelectedKey(key);
        alert(statIdeas[key].description);
        //setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedKey(null);
    };

    return (
    <Box sx={{ mt: { xs: 3, md: 5 }, px: { xs: 2, md: 5 }, overflowX: "hidden" }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* LEFT SECTION (Profile Info & Stats) */}
        <Grid item xs={12} md={8}>
          {/* Profile Header */}
          <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: "column", sm: "row" }, alignItems: "center", gap: 2 }}>
              <CustomAvatar
                size={200}
                letter={(user.firstName || "?")?.charAt(0).toUpperCase()}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', ml: { xs: 0, sm: 2 }, justifyContent: 'flex-start', alignItems: { xs: "center", sm: "flex-start" } }}>
                {isEditing ? (
                  <TextField
                    value={changedName}
                    onChange={(e) => setChangedName(e.target.value)}
                    size="small"
                    variant="standard"
                    InputProps={{
                      style: { color: "white", fontSize: "1.25rem", fontWeight: 500 }
                    }}
                    sx={{
                      width: { xs: "200px", sm: "250px" },
                      mb: 1,
                      "& .MuiInputBase-input": { padding: 0 },
                      "& .MuiInput-underline:before": { borderBottomColor: "gray" },
                      "& .MuiInput-underline:hover:before": { borderBottomColor: "orange !important" },
                      "& .MuiInput-underline:after": { borderBottomColor: "yellow" },
                    }}
                  />
                ) : (
                  <Typography variant="h6" color="white" sx={{ fontSize: "1.25rem", fontWeight: 500, mb: 1, width: { xs: "200px", sm: "250px" }, textAlign: { xs: "center", sm: "left" } }}>
                    {user.firstName || "Guest"}
                  </Typography>
                )}

                <Stack direction="row" spacing={1} mt={1}>
                  {isEditing ? (
                    <>
                      <Button variant="contained" color="success" size="small" onClick={handleSave}>Save</Button>
                      <Button variant="outlined" color="error" size="small" onClick={() => { setChangedName(user?.firstName || ""); setIsEditing(false); }}>Cancel</Button>
                    </>
                  ) : (
                    <Button variant="outlined" color="warning" size="small" onClick={() => setIsEditing(true)}>Edit</Button>
                  )}
                </Stack>
              </Box>
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

          {/* Withdraw / Connect Button */}
          {user.annonymous ? (
            <Button variant="contained" fullWidth sx={{ bgcolor: "#3b82f6", mb: 3 }} onClick={() => alert("Open account connection flow")}>
              Connect Google <Google />
            </Button>
          ) : isTop10 ? (
            <Button variant="contained" fullWidth sx={{ bgcolor: "#22c55e", mb: 3 }} onClick={() => alert("Withdraw triggered!")}>
              Claim
            </Button>
          ) : (
            <Tooltip title="Your rank must be in the Top 10 today to withdraw">
              <span style={{ width: "100%" }}>
                <Button variant="contained" fullWidth disabled sx={{ bgcolor: "#9ca3af", mb: 3 }}>
                  Claim Coins
                </Button>
              </span>
            </Tooltip>
          )}

          {/* For small screens, badges */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <BadgesAndAchievements />
          </Box>
        </Grid>

        {/* RIGHT SECTION (Badges for big screens) */}
        <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <BadgesAndAchievements />
        </Grid>
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
