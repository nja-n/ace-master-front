import React, { useState, useEffect } from "react";
import {
    Avatar, Button, Typography, Box, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { saveUser, createUniqueRoom, validateUniqueRoom, loadCoinBalance } from '../components/methods';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';


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

    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');

    const [coinBalance, setCoinBalance] = useState(0);

    const [networkError, setNetworkError] = useState(false);

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

            fetch(loadCoinBalance + '?id=' + storedId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setCoinBalance(data);
                })
                .catch((error) => {
                    setNetworkError(true);
                    alert('Server Error, please try again later');
                    console.error("Error loading coin balance:", error);
                });
        }
    }, [storedId]);

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
        if(coinBalance < 100) {alert('You do not have enough coins to play. Please earn more coins by complete tasks.'); return;}
        if (window.confirm('Are you ready .? Your coin of 100 has been used for this round')) navigate("/game");
    };


    const handleCreateGame = async () => {
        if (window.confirm("Are you ready to create a Room?")) {
            try {
                const response = await fetch(createUniqueRoom);
                if (!response.ok) throw new Error("Failed to create room");

                const roomId = await response.json();
                navigate(`/game/${roomId}`);
            } catch (error) {
                console.error("Error creating room:", error);
                alert("Failed to create room. Please try again.");
            }
        }
    };

    const handleJoinRoom = () => {
        setJoinModalOpen(true);
    }

    const handlePlay = async () => {
        const trimmedRoomId = roomIdInput.trim();

        if (trimmedRoomId === '') {
            setRoomIdInput('');
            alert('Please enter a valid Room ID');
            return;
        }

        try {
            const response = await fetch(validateUniqueRoom, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ roomId: trimmedRoomId }),
            });

            const result = await response.text();

            if (result === 'Y') {
                navigate(`/game/${trimmedRoomId}`);
                setJoinModalOpen(false);
                setRoomIdInput('');
            } else {
                alert('Room ID not found or inactive.');
            }
        } catch (error) {
            console.error('Error validating room:', error);
            alert('An error occurred while validating the Room ID.');
        }
    };

    const handleMenuSelected = (i) => {
        switch (i) {
            case 1:
                ///navigate('/tasks');
                alert('Please wait a while. Server updates soon.!');
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

    const handleStartAiPlay = () => {
        if (window.confirm('Are you ready to play with AI?')) {
            navigate("/game/ai");
        }
    }

    return (
        <Box
            sx={{
                backgroundColor: "#2e7d32",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: "#1b5e20",
                marginTop:'10px',
             }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between",
                     marginLeft:'15px', marginRight:'15px',
                 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Ace Master
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        <AccountBalanceWallet /> <Typography component="span" sx={{ fontWeight: "bold", color: "#ff9800" }}>{coinBalance}</Typography>
                    </Typography>

                    {/* Desktop Buttons */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
                        {/* <Button color="inherit" onClick={() => handleMenuSelected(1)}>Chat</Button> */}
                        <Button color="inherit" onClick={() => handleMenuSelected(1)}>Task</Button>
                        <Button color="inherit" onClick={() => handleMenuSelected(2)}>About</Button>
                        <Button color="inherit" onClick={() => handleMenuSelected(4)}>Contact Us</Button>
                    </Box>

                    {/* Mobile Menu */}
                    <IconButton edge="end" color="inherit" onClick={handleMenuOpen} sx={{ display: { xs: "block", sm: "none" } }}>
                        <MoreVert />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => { handleMenuSelected(1); handleMenuClose(); }}>Task</MenuItem>
                        <MenuItem onClick={() => { handleMenuSelected(2); handleMenuClose(); }}>About</MenuItem>
                        <MenuItem onClick={() => { handleMenuSelected(4); handleMenuClose(); }}>Contact Us</MenuItem>
                    </Menu>
                    </Box>
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
                marginBottom: "7%"
            }}>
                <Button
                    variant="contained"
                    color="info"
                    onClick={handleStartAiPlay}
                    disabled={!storedName || networkError}
                >
                    Play with AI
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleStartGame}
                    disabled={!storedName || coinBalance < 100 || networkError}
                >
                    Start Online
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateGame}
                    disabled={!storedName || networkError}
                >
                    Create Room
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleJoinRoom}
                    disabled={!storedName || networkError}
                >
                    Join Room
                </Button>
            </Box>
            {networkError && <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                marginBottom: "7%"
            }}>
                <Typography variant="body2" color="white" bgcolor={'red'}
                    padding={1} borderRadius={2} fontWeight={'bold'}>
                    Server Error
                </Typography>
            </Box>}
            <Dialog open={joinModalOpen} onClose={() => setJoinModalOpen(false)}>
                <DialogTitle>Join a Game Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room ID"
                        type="text"
                        inputProps={{ maxLength: 5, inputMode: 'numeric', pattern: '[0-9]*' }}
                        fullWidth
                        value={roomIdInput}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setRoomIdInput(value);
                            }
                          }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setJoinModalOpen(false)}>Cancel</Button>
                    <Button onClick={handlePlay} variant="contained" color="primary">Play</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

};

export default Home;
