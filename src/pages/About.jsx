import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Paper, Divider, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { versionHistory } from "../components/methods";
import { HorizontalRule } from "@mui/icons-material";

const About = () => {
    const navigate = useNavigate();
    const [version, setVersion] = useState("");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch version history from backend
    useEffect(() => {
        const fetchVersionHistory = async () => {
            try {
                const response = await fetch(versionHistory); // Replace with your backend API
                if (!response.ok) throw new Error("Failed to fetch version history");

                console.log(response)

                const data = await response.json();
                setVersion(data.currentVersion);
                setHistory(data.history);
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 3,
                minHeight: "100vh",
                backgroundColor: "#2e7d32"
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, width: "100%" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    About Ace Master
                </Typography>
                <Typography variant="body1" paragraph>
                Ace Master is an exhilarating card game that challenges your strategic thinking and lightning-fast decision-making! Inspired by the classic Kazhutha game from Kerala, Ace Master brings a unique twist to traditional card battles. Compete with friends or AI opponents, outsmart your rivals, and rise through the ranks to claim the title of the ultimate and looser of the deck! 🃏🔥
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" fontWeight="bold">
                    Developer Info
                </Typography>
                <Typography variant="body1">🚀 Developed by: <strong>AEITHER DEV</strong></Typography>
                <Typography variant="body2">📧 Email: <a href="mailto:aether.cash@hotmail.com">mail now</a></Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h5" fontWeight="bold">
                    Version Information
                </Typography>
                {loading ? (
                    <CircularProgress size={24} sx={{ mt: 1 }} />
                ) : (
                    <>
                        <Typography variant="body1">🔹 Current Version: <strong>{version}</strong></Typography>
                        <Divider sx={{ my:0, ml:2, }} />
                        <Typography variant="h6" sx={{ mt: 2 }}>Version History</Typography>
                        {history.length > 0 ? (
                            history.map((entry, index) => (
                                <Paper key={index} variant="body2">
                                    🗓️ {entry.date} - 🔹 {entry.version}
                                    <Typography>{entry.description}</Typography>
                                </Paper>
                            ))
                        ) : (
                            <Typography variant="body2">No version history available.</Typography>
                        )}
                    </>
                )}

                <Divider sx={{ my: 2 }} />

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = "mailto:aether.cash@hotmail.com"}
                >
                    Contact Us
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    sx={{ mt: 1 }}
                    onClick={() => navigate("/")}
                >
                    Back to Home
                </Button>
            </Paper>
        </Box>
    );
};

export default About;
