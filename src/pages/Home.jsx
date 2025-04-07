import React, { useState, useEffect } from "react";
import { Avatar, Button, Container, Typography, Box, TextField } from "@mui/material";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { saveUser } from '../components/methods';

const Home = () => {
    const [userName, setUserName] = useState("");
    const [storedName, setStoredName] = useState(localStorage.getItem("userName") || "");
    const [storedId, setStoredId] = useState(localStorage.getItem("userId") || "");
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = window.innerWidth < 600;

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);



    const getDeviceInfo = async () => {
        // Get OS and Platform
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;

        return { userAgent, platform, screenWidth, screenHeight };
    };


    useEffect(() => {
        const savedName = localStorage.getItem("userName");
        if (savedName) {
            setStoredName(savedName);
            setStoredId(localStorage.getItem("userId"));
        }
    }, []);

    const handleChangeName = (value) => {
        const capitalizedValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
        setUserName(capitalizedValue);
    };

    const handleSaveName = async () => {
        const deviceInfo = await getDeviceInfo();
        try {
            const response = await fetch(saveUser, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: storedId,
                    firstName: userName,
                    os: deviceInfo.platform,
                    platform: deviceInfo.userAgent,
                    screenWidth: deviceInfo.screenWidth,
                    screenHeight: deviceInfo.screenHeight
                }),
                //body: JSON.stringify({ name: userName }),
            });

            if (!response.ok) throw new Error("Failed to save user");

            const data = await response.json(); // Assuming the server returns { id: "12345" }
            localStorage.setItem("userName", userName);
            localStorage.setItem("userId", data.id); // Store the returned ID
            setStoredName(userName);
            setStoredId(data.id)
            alert('Player Name have been saved.');
        } catch (error) {
            alert('something went wrong, please try again');
            console.error("Error saving user:", error);
        }
    };

    const handleStartGame = () => {
        alert(localStorage.getItem("userId"));
        navigate("/game");
    };

    const handleMenuSelected = (i) => {
        switch (i) {
            case 1:
                alert('We are still working on it');
                break;
            case 2:
                navigate('/about');
                break;
            case 3:
                window.location.href = "mailto:aether.cash@hotmail.com?subject=Support Request&body=Hello, I need assistance with...";
                break;
            case 4:
                window.location.href = "mailto:aether.cash@hotmail.com?subject=Contact Request&body=Hello, I need assistance with...";
                break;
            default:
                alert('Please select correct action');
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#2e7d32",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px",
            }}
        >
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: "#1b5e20" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Ace Master
                    </Typography>

                    {/* Desktop Buttons */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
                        <Button color="inherit" onClick={() => handleMenuSelected(1)}>Chat</Button>
                        <Button color="inherit" onClick={() => handleMenuSelected(2)}>About</Button>
                        <Button color="inherit" onClick={() => handleMenuSelected(4)}>Contact Us</Button>
                    </Box>

                    {/* Mobile Menu */}
                    <IconButton edge="end" color="inherit" onClick={handleMenuOpen} sx={{ display: { xs: "block", sm: "none" } }}>
                        <MoreVert />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => { handleMenuSelected(1); handleMenuClose(); }}>Chat</MenuItem>
                        <MenuItem onClick={() => { handleMenuSelected(2); handleMenuClose(); }}>About</MenuItem>
                        <MenuItem onClick={() => { handleMenuSelected(4); handleMenuClose(); }}>Contact Us</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* User Info */}
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Avatar
                    sx={{
                        width: 150,
                        height: 150,
                        border: "3px solid white",
                        fontSize: "50px",
                        bgcolor: "#1b5e20",
                        margin: "auto",
                    }}
                >
                    {(storedName || userName)?.charAt(0).toUpperCase() || "?"}
                </Avatar>

                {storedName && !isEditing ? (
                    <>
                        <Typography variant="h4" color="white" sx={{ marginTop: "10px" }}>
                            {storedName}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => {
                                    setIsEditing(true);
                                    setUserName(storedName);
                                }}
                            >
                                Edit
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Box sx={{ marginTop: "20px", textAlign: "center" }}>
                        <TextField
                            value={userName}
                            onChange={(e) => handleChangeName(e.target.value)}
                            placeholder="Enter your name"
                            variant="outlined"
                            sx={{ backgroundColor: "white", borderRadius: "5px", marginBottom: "10px", width: "250px" }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 1 }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    handleSaveName();
                                    setIsEditing(false);
                                }}
                                disabled={!userName}
                            >
                                Save
                            </Button>
                            {storedName && (
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setUserName(""); // or revert to storedName
                                    }}
                                >
                                    Cancel
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Bottom Buttons */}
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                marginBottom: "30px"
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartGame}
                    disabled={!storedName}
                >
                    Start Online
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => alert('We are still working on it')}
                    disabled={!storedName}
                >
                    Create Room
                </Button>
            </Box>
        </Box>
    );

};

export default Home;
