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
        console.log(saveUser + '\n');
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
            alert('Saved as New User');
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
                //padding: "20px"
            }}
        >
            <AppBar position="static" sx={{ backgroundColor: "#1b5e20", }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* App Name */}
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Ace Master
                    </Typography>

                    {/* Desktop Buttons */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
                        <Button color="inherit" onClick={() => handleMenuSelected(1)}>Chat</Button>
                        <Button color="inherit" onClick={() => handleMenuSelected(2)}>About</Button>
                        {/* <Button color="inherit" onClick={() => handleMenuSelected(3)}>Feedback</Button> */}
                        <Button color="inherit" onClick={() => handleMenuSelected(4)}>Contact Us</Button>
                    </Box>

                    {/* Mobile Menu Icon */}
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleMenuOpen}
                        sx={{ display: { xs: "block", sm: "none" } }}
                    >
                        <MoreVert />
                    </IconButton>

                    {/* Mobile Dropdown Menu */}
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => { handleMenuSelected(1); handleMenuClose(); }}>Chat</MenuItem>
                        <MenuItem onClick={() => { handleMenuSelected(2); handleMenuClose(); }}>About</MenuItem>
                        {/* <MenuItem onClick={() => { handleMenuSelected(3); handleMenuClose(); }}>Feedback</MenuItem> */}
                        <MenuItem onClick={() => { handleMenuSelected(4); handleMenuClose(); }}>Contact Us</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            {/* Top - User Name Display */}
            <Typography variant="h4" color="white" sx={{ marginTop: "20px" }}>
                {storedName || "Enter Your Name"}
            </Typography>

            {/* Center - Avatar */}
            <Avatar
                src="https://via.placeholder.com/150"
                alt="Profile Avatar"
                sx={{ width: 150, height: 150, border: "3px solid white" }}
            />

            {/* Input Field, Save Button, and Start Button */}
            <Container sx={{ textAlign: "center", marginBottom: "40px" }}>
                <TextField
                    value={userName}
                    onChange={(e) => handleChangeName(e.target.value)}
                    placeholder="Enter your name"
                    variant="outlined"
                    sx={{ backgroundColor: "white", borderRadius: "5px", marginBottom: "10px" }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSaveName}
                    sx={{ display: "block", margin: "10px auto", padding: "10px 20px" }}
                    disabled={!userName}
                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartGame}
                    sx={{ display: "block", margin: "10px auto", padding: "10px 20px" }}
                    disabled={!storedName}
                >
                    Start Game
                </Button>
            </Container>
        </Box>
    );
};

export default Home;
