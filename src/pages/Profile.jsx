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
        <Box sx={{ mt: 5, overflow: "auto" }}>
            <Grid container spacing={3}>
                {/* LEFT SECTION (Profile Info & Stats) */}
                <Grid item xs={12} md={8}>
                    {/* Profile Header */}
                    <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
                            <CustomAvatar
                                size={200}
                                letter={(user.firstName || "?")?.charAt(0).toUpperCase()}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, justifyContent: 'left' }}>

                                {isEditing ? (
                                    <TextField
                                        value={changedName}
                                        onChange={(e) => setChangedName(e.target.value)}
                                        size="small"
                                        variant="standard"   // 👈 use 'standard' instead of 'filled'
                                        InputProps={{
                                            // disableUnderline: false, // removes underline
                                            style: {
                                                color: "white",        // matches Typography
                                                fontSize: "1.25rem",   // ~ Typography h6
                                                fontWeight: 500,
                                            },
                                        }}
                                        sx={{
                                            width: "250px",
                                            marginBottom: "10px",
                                            "& .MuiInputBase-input": {
                                                padding: 0,            // removes extra padding
                                            },
                                            "& .MuiInput-underline:before": {
                                                borderBottomColor: "gray",   // 👈 default (inactive)
                                            },
                                            "& .MuiInput-underline:hover:before": {
                                                borderBottomColor: "orange !important", // 👈 hover color
                                            },
                                            "& .MuiInput-underline:after": {
                                                borderBottomColor: "yellow", // 👈 active/focused color
                                            },
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        variant="h6"
                                        color="white"
                                        sx={{
                                            fontSize: "1.25rem",
                                            fontWeight: 500,
                                            marginBottom: "10px",
                                            width: "250px",          // 👈 same width as TextField
                                        }}
                                    >
                                        {user.firstName || "Guest"}
                                    </Typography>
                                )}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "left",
                                        gap: 2,
                                        marginTop: 2
                                    }}
                                >
                                    {isEditing ? (
                                        <>
                                            <Button variant="contained" color="success" onClick={handleSave}>
                                                Save
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => {
                                                    setChangedName(user?.firstName || "");
                                                    setIsEditing(false);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Box>
                            </Box>

                        </Box>

                        <Typography variant="body2" color="gray">
                            Level {profile.level || 1}
                        </Typography>
                        {/* Progress Bar for XP */}
                        <Box sx={{ width: '60%', mt: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={profile.xpPercent || 0}
                                sx={{ height: 8, borderRadius: 5, bgcolor: "#334155" }}
                            />
                        </Box>
                    </Stack>

                    {/* Stats Row */}
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
                        <Card sx={{ flex: 1, p: 2, background: "linear-gradient(135deg,#1e293b,#334155)", textAlign: "center", borderRadius: 3, boxShadow: 4 }}
                            onClick={() => handleOpen("dayStreak")}>
                            <FlashOnIcon sx={{ color: "#facc15", fontSize: 32 }} />
                            <Typography variant="body2" color="#fff">Day Streak</Typography>
                            <Typography variant="h6" color="#facc15">{profile.dayStreak || 0}</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, background: "linear-gradient(135deg,#1e293b,#334155)", textAlign: "center", borderRadius: 3, boxShadow: 4 }}
                            onClick={() => handleOpen("league")}>
                            <EmojiEventsIcon sx={{ color: "#fbbf24", fontSize: 32 }} />
                            <Typography variant="body2" color="#fff">League</Typography>
                            <Typography variant="h6" color="#fbbf24">
                                {(profile.league || "Bronze").toUpperCase()}
                            </Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, background: "linear-gradient(135deg,#1e293b,#334155)", textAlign: "center", borderRadius: 3, boxShadow: 4 }}
                            onClick={() => handleOpen("winStreak")}>
                            <Box display="flex" justifyContent="center">
                                <img src={CoinIcon} alt="Coin" style={{ width: '28px', height: '28px' }} />
                            </Box>
                            <Typography variant="body2" color="#fff">Win Streak</Typography>
                            <Typography variant="h6" color="#fbbf24">{profile.currentStreak || 0}</Typography>
                        </Card>
                    </Stack>

                    {/* Extra Stats */}
                    <Stack direction="row" spacing={2} justifyContent="space-between" marginBottom={2}>
                        <Card sx={{ flex: 1, p: 2, bgcolor: "#1e293b", textAlign: "center" }}
                            onClick={() => handleOpen("gamesPlayed")}>
                            <Typography variant="body2" color="gray">Games Played</Typography>
                            <Typography variant="h6" color="white">{profile.count || 0}</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, bgcolor: "#1e293b", textAlign: "center" }}
                            onClick={() => handleOpen("winRate")}>
                            <Typography variant="body2" color="gray">Win Rate</Typography>
                            <Typography variant="h6" color="white">{profile.winRate.toFixed(2) || 0}%</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, bgcolor: "#1e293b", textAlign: "center" }}
                            onClick={() => handleOpen("rank")}>
                            <Typography variant="body2" color="gray">Rank</Typography>
                            <Typography variant="h6" color="white">{profile.rank || "Unranked"}</Typography>
                        </Card>
                    </Stack>

                    {/* Withdraw / Connect Button */}
                    {user.annonymous ? (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: "#3b82f6", mb: 3 }}
                            onClick={() => alert("Open account connection flow")}
                        >
                            Connect Google <Google />
                        </Button>
                    ) : isTop10 ? (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: "#22c55e", mb: 3 }}
                            onClick={() => alert("Withdraw triggered!")}
                        >
                            Claim
                        </Button>
                    ) : (
                        <Tooltip title="Your rank must be in the Top 10 today to withdraw">
                            <span style={{ width: "100%" }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled
                                    sx={{ bgcolor: "#9ca3af", mb: 3 }}
                                >
                                    Claim Coins
                                </Button>
                            </span>
                        </Tooltip>
                    )}


                    {/* For small screens, show badges & achievements here */}
                    <Box sx={{ display: { xs: "block", md: "none" } }}>
                        <BadgesAndAchievements />
                    </Box>
                </Grid>

                {/* RIGHT SECTION (Badges & Achievements for big screens) */}
                <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ display: { xs: "none", md: "block" } }}
                >
                    <BadgesAndAchievements />
                </Grid>
            </Grid>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                {selectedKey && (
                    <>
                        <DialogTitle>{statIdeas[selectedKey].title}
                            <IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{
                                    position: "absolute",
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
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
