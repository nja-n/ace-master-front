import { Google } from "@mui/icons-material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { Box, Button, Card, Grid, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { useLoading } from "../components/LoadingContext";
import CustomAvatar from "../components/ui/CustomAvathar";
import { useUser } from "../components/ui/UserContext";
import { auth } from "../firebase-config";
import CoinIcon from '../images/aeither_coin.png';
import { useEffect, useState } from "react";
import { apiClient } from "../components/ApIClient";
import { fetchAchievements } from "../components/methods";

export default function ProfilePage({ isTop10 }) {
    const { user, loading } = useUser();
    const { setLoading } = useLoading();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await apiClient(fetchAchievements, {
                    userId: user.id
                });
                setProfile(response);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }
        if (user === null) {
            setLoading(true);
            return <Box sx={{ p: 2, textAlign: "center", color: "#fff" }}>Loading...</Box>;
        }
        fetchProfile();
    }, [user]);
    //isTop10 = isTop10 || true;
    setLoading(false);

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

    return (
        <Box sx={{ mx: "auto", mt: 5, overflow: "auto" }}>
            <Grid container spacing={3}>
                {/* LEFT SECTION (Profile Info & Stats) */}
                <Grid item xs={12} md={8}>
                    {/* Profile Header */}
                    <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <CustomAvatar
                            size={200}
                            letter={(user.firstName || "?")?.charAt(0).toUpperCase()}
                        />
                        <Typography variant="h6" color="white">{user.firstName || "Guest"}</Typography>
                        <Typography variant="body2" color="gray">
                            Level {user.level || 1}
                        </Typography>
                        {/* Progress Bar for XP */}
                        <Box sx={{ width: '60%', mt: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={user.xpPercent || 30}
                                sx={{ height: 8, borderRadius: 5, bgcolor: "#334155" }}
                            />
                        </Box>
                    </Stack>

                    {/* Stats Row */}
                    <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mb: 3 }}>
                        <Card sx={{ flex: 1, p: 2, background: "linear-gradient(135deg,#1e293b,#334155)", textAlign: "center", borderRadius: 3, boxShadow: 4 }}>
                            <FlashOnIcon sx={{ color: "#facc15", fontSize: 32 }} />
                            <Typography variant="body2" color="#fff">Streak</Typography>
                            <Typography variant="h6" color="#facc15">{user.streakDays || 0} Days</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, background: "linear-gradient(135deg,#1e293b,#334155)", textAlign: "center", borderRadius: 3, boxShadow: 4 }}>
                            <EmojiEventsIcon sx={{ color: "#fbbf24", fontSize: 32 }} />
                            <Typography variant="body2" color="#fff">League</Typography>
                            <Typography variant="h6" color="#fbbf24">{user.league || "Bronze"}</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, background: "linear-gradient(135deg,#1e293b,#334155)", textAlign: "center", borderRadius: 3, boxShadow: 4 }}>
                            <Box display="flex" justifyContent="center">
                                <img src={CoinIcon} alt="Coin" style={{ width: '28px', height: '28px' }} />
                            </Box>
                            <Typography variant="body2" color="#fff">Coins</Typography>
                            <Typography variant="h6" color="#fbbf24">{user.coins || 0}</Typography>
                        </Card>
                    </Stack>

                    {/* Extra Stats */}
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Card sx={{ flex: 1, p: 2, bgcolor: "#1e293b", textAlign: "center" }}>
                            <Typography variant="body2" color="gray">Games Played</Typography>
                            <Typography variant="h6" color="white">{user.gamesPlayed || 0}</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, bgcolor: "#1e293b", textAlign: "center" }}>
                            <Typography variant="body2" color="gray">Win Rate</Typography>
                            <Typography variant="h6" color="white">{user.winRate || 0}%</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 2, bgcolor: "#1e293b", textAlign: "center" }}>
                            <Typography variant="body2" color="gray">Rank</Typography>
                            <Typography variant="h6" color="white">{user.rank || "Unranked"}</Typography>
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
                            Withdraw to POL
                        </Button>
                    ) : (
                        <Tooltip title="You must be in the Top 10 today to withdraw">
                            <span style={{ width: "100%" }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled
                                    sx={{ bgcolor: "#9ca3af", mb: 3 }}
                                >
                                    Withdraw to POL
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
        </Box>
    );
}

function BadgesAndAchievements() {
    return (
        <>
            {/* Badges */}
            <Typography variant="h6" sx={{ mb: 1 }}>Badges</Typography>
            <Typography variant="body2" color="gray" sx={{ mb: 3 }}>
                Coming soon...
            </Typography>

            {/* Achievements */}
            <Typography variant="h6" sx={{ mb: 1 }}>Achievements</Typography>
            <Typography variant="body2" color="gray">
                Coming soon...
            </Typography>
        </>
    );
}
