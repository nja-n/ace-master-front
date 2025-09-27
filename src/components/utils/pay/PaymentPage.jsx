import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Chip,
} from "@mui/material";

const coinPackets = [
    { price: 10, coins: 1000 },
    { price: 50, coins: 6000 },
    { price: 100, coins: 13000, best: true }, // Premium
    { price: 250, coins: 35000 },
    { price: 500, coins: 75000 },
];

const acePassOptions = [
    {
        duration: "1 Month",
        price: 199,
        features: ["x2 Daily Bonus Coins", "Ad-Free Gameplay", "Exclusive Avatars & Themes", "Special Daily Missions"],
    },
    {
        duration: "3 Months",
        price: 499,
        features: ["x2 Daily Bonus Coins", "Ad-Free Gameplay", "Exclusive Avatars & Themes", "Special Daily Missions", "Priority Matchmaking"],
    },
    {
        duration: "6 Months",
        price: 899,
        features: ["x2 Daily Bonus Coins", "Ad-Free Gameplay", "Exclusive Avatars & Themes", "Special Daily Missions", "Priority Matchmaking", "Limited-Time Event Access", "Extra Rewards"],
    },
    {
        duration: "1 Year",
        price: 1499,
        features: ["x2 Daily Bonus Coins", "Ad-Free Gameplay", "Exclusive Avatars & Themes", "Special Daily Missions", "Priority Matchmaking", "Limited-Time Event Access", "Extra Rewards", "Exclusive Seasonal Items", "VIP Badge"],
    },
];

const PaymentPage = () => {
    const navigate = useNavigate();

    const handlePayment = (price, coins) => {
        alert("Payment Gateway Error. Please try again.");
        navigate(-1);
    };

    return (
        <Box
            sx={{
                p: 3,
                textAlign: "center",
                minHeight: "100vh",
                // bgcolor: "#1C1C1E", // Dark mode background
            }}
        >
            <Typography
                variant="h5"
                sx={{ color: "gold", mb: 3, fontWeight: "bold" }}
            >
                💰 Buy Ace Pass
            </Typography>

            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {acePassOptions.map((pack, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                boxShadow: "0 0 35px rgba(255, 215, 0, 0.9)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                position: "relative",
                                border: "2px solid gold",
                                bgcolor: "#2B2B2B",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": { transform: "scale(1.05)", boxShadow: "0 0 45px rgba(255, 215, 0, 1)" },
                            }}
                        >
                            <Chip
                                label="⭐ Ace Pass"
                                sx={{
                                    position: "absolute",
                                    top: 12,
                                    right: 12,
                                    bgcolor: "rgba(255, 215, 0, 0.7)", // Transparent yellow
                                    color: "#111",
                                    fontWeight: "bold",
                                    px: 2,
                                    py: 0.5,
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ color: "#FFD700", fontWeight: "bold", mb: 1 }}>
                                    {pack.duration} Subscription
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#fff", mb: 2 }}>
                                    ₹{pack.price}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    {pack.features.map((feature, i) => (
                                        <Typography key={i} variant="body2" sx={{ color: "#fff", mb: 0.5 }}>
                                            🔹 {feature}
                                        </Typography>
                                    ))}
                                </Box>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handlePayment(pack.price, 0)}
                                    sx={{ bgcolor: "#FFD700", color: "#111", fontWeight: "bold", borderRadius: 2, "&:hover": { bgcolor: "#FFC107" } }}
                                >
                                    Buy Ace Pass
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>


            <Typography
                variant="h5"
                sx={{ color: "gold", mb: 3, mt: 3, fontWeight: "bold" }}
            >
                💰 Buy Coins
            </Typography>

            <Grid container spacing={3} justifyContent="center" alignItems="stretch">
                {coinPackets.map((pack, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: pack.best
                                    ? "0 0 25px rgba(255, 215, 0, 0.7)"
                                    : "0 0 10px rgba(0,0,0,0.2)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                position: "relative",
                                border: pack.best ? "2px solid gold" : "1px solid #555",
                                bgcolor: pack.best ? "#2B2B2B" : "#1F1F1F",
                                transition: "transform 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    boxShadow: pack.best
                                        ? "0 0 35px rgba(255, 215, 0, 0.9)"
                                        : "0 0 20px rgba(255, 255, 255, 0.2)",
                                },
                            }}
                        >
                            {pack.best && (
                                <Chip
                                    label="⭐ Best Value"
                                    sx={{
                                        position: "absolute",
                                        top: 2,
                                        right: 2,
                                        bgcolor: "gold",
                                        color: "#111",
                                        fontWeight: "bold",
                                    }}
                                />
                            )}

                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: "#FFD700",
                                        fontWeight: "bold",
                                        mb: 1,
                                    }}
                                >
                                    {pack.coins.toLocaleString()} Coins
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#aaa", mb: 2 }}
                                >
                                    Only ₹{pack.price}
                                </Typography>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handlePayment(pack.price, pack.coins)}
                                    sx={{
                                        bgcolor: pack.best ? "#FFD700" : "gold",
                                        color: "#111",
                                        fontWeight: "bold",
                                        borderRadius: 2,
                                        "&:hover": { bgcolor: "#FFC107" },
                                    }}
                                >
                                    Buy Now
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PaymentPage;
