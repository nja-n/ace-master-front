import React from "react";
import { Box, Typography, Button, Card, Avatar, Stack, Grid, Tooltip } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useUser } from "../components/ui/UserContext";
import CommonHeader from "../components/ui/CommonHeader";
import CustomAvatar from "../components/ui/CustomAvathar";
import { useLoading } from "../components/LoadingContext";
import { Google } from "@mui/icons-material";
import { linkWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase-config";
import CoinIcon from '../images/aeither_coin.png';

export default function ProfilePage({ isTop10 }) {
    const { user, loading } = useUser();
    const { setLoading } = useLoading();

    if (user === null) {
        setLoading(true);
        return <Box sx={{ p: 2, textAlign: "center", color: "#fff" }}>Loading...</Box>;
    }
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
        <Box sx={{ mx: "auto", mt: 5, px: 3, maxWidth: "1200px" }}>
            <CommonHeader coinBalance={user.coins} />
            <Grid container spacing={3}>
                {/* LEFT SECTION (Profile Info & Stats) */}
                <Grid item xs={12} md={8}>
                    {/* Profile Header */}
                    <Stack alignItems="center" spacing={1} sx={{ mb: 3 }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                        }}>
                            <CustomAvatar
                                size={200} letter={(user.firstName || "?")?.charAt(0).toUpperCase() || "?"}
                            />
                        </Box>
                        <Typography variant="h6" color="white">{user.firstName || "Guest"}</Typography>
                        <Typography variant="body2" color="gray">
                            Level {user.level || 1}
                        </Typography>
                    </Stack>

                    {/* Top Stats Row */}
                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                        sx={{ mb: 3 }}
                    >
                        <Card sx={{ flex: 1, p: 1, bgcolor: "#1e293b", textAlign: "center" }}>
                            <FlashOnIcon sx={{ color: "#facc15" }} />
                            <Typography variant="body2" color="#fff">Streak Days</Typography>
                            <Typography variant="h6" color="#fff">{user.streakDays || 0}</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 1, bgcolor: "#1e293b", textAlign: "center" }}>
                            <EmojiEventsIcon sx={{ color: "#fbbf24" }} />
                            <Typography variant="body2" color="#fff">League</Typography>
                            <Typography variant="h6" color="#fff">{user.league || "Bronze"}</Typography>
                        </Card>
                        <Card sx={{ flex: 1, p: 1, bgcolor: "#1e293b", textAlign: "center" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <img src={CoinIcon} alt="Coin" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                            </Box>
                            <Typography variant="body2" color="#fff">Coins</Typography>
                            <Typography variant="h6" color="#fff">{user.coins || 0}</Typography>
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
