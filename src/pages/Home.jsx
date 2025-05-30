import React, { useState, useEffect } from "react";
import {
    Avatar, Button, Typography, Box, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Stack
} from "@mui/material";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { saveUser, createUniqueRoom, validateUniqueRoom, loadCoinBalance } from '../components/methods';
import CoinIcon from '../images/aeither_coin.png';
import CustomAvatar from "../components/ui/CustomAvathar";
import GloriousButton from "../components/ui/GloriousButton";
import AceMasterLogo from "../components/ui/GameLogoHeader";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import FacebookLogin from "./Login";
import GameTutorial from "../components/tutorial/GameTutorial";
import bgGreenTable from '../images/bg-home.png';
import { getRandomProTip } from "../components/Utiliy";
import RoomSessionModal from "../components/ui/RoomSession";


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

    const [authenticated, setAuthenticated] = useState(storedId ? true : false);

    const [tutorialSeen, setTutorialSeen] = useState(true);

    const [roomModalOpen, setRoomModalOpen] = useState(false);

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
        } else {
            setTutorialSeen(false);
        }
    }, [storedId]);

    const handleChangeName = (value) => {
        const capitalizedValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
        setUserName(capitalizedValue);
    };

    const handleSaveName = async () => {
        let isNew = false;
        if (storedId === "") {
            isNew = true;
        }

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

            if (isNew) {
                navigate(`/game/ai`);
            }
        } catch (error) {
            alert('something went wrong, please try again');
            console.error("Error saving user:", error);
        }
    };

    const handleStartGame = () => {
        if (coinBalance < 100) { alert('You do not have enough coins to play. Please earn more coins by complete tasks.'); return; }
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
            case 4:
                navigate('/contact');
                break;
            case 3:
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

    const handleGuestLogin = () => {
        setAuthenticated(true);
        alert('Please add your Name in desired Field');
    };

    const handleFacebookLogin = (fbData) => {
        console.log("Facebook login data:", fbData);
        alert('Facebook Logined with success');
    };

    return (
        <Box
            sx={{
                backgroundColor: "#2e7d32",
                backgroundImage: `url(${bgGreenTable})`,
                backgroundSize: "contain",       // Show full image without cutting
                backgroundPosition: "top",    // Center the image
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            {!tutorialSeen && authenticated
                && <GameTutorial joyrideRef={0} sceneNum={1} />}

            {/* AppBar */}
            <AppBar position="static" sx={{
                backgroundColor: "#1b5e2000",
                marginTop: '10px',
            }}>
                <Toolbar sx={{
                    display: "flex", justifyContent: "space-between",
                    marginLeft: '15px', marginRight: '15px',
                }}>
                    {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Ace Master
                    </Typography> */}
                    <AceMasterLogo />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <img src={CoinIcon} alt="Coin" style={{ width: '24px', height: '24px', marginRight: '8px' }} />

                            </Box>
                            <Typography component="span" sx={{ fontWeight: "bold", color: "#ff9800" }}>{coinBalance}</Typography>
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

                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                }}>
                    <CustomAvatar
                        size={200} letter={(storedName || userName)?.charAt(0).toUpperCase() || "?"}
                    />
                </Box>
                {/* <Avatar
                    sx={{
                        width: 10,
                        height: 150,
                        border: "3px solid white",
                        fontSize: "50px",
                        bgcolor: "#1b5e20",
                        margin: "auto",
                    }}
                >
                    {(storedName || userName)?.charAt(0).toUpperCase() || "?"}
                </Avatar> */}

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
                            id="name-input"
                            value={userName}
                            onChange={(e) => handleChangeName(e.target.value)}
                            placeholder="Enter your name"
                            variant="outlined"
                            sx={{ backgroundColor: "white", borderRadius: "5px", marginBottom: "10px", width: "250px" }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 1 }}>
                            <GloriousButton
                                onClick={() => {
                                    handleSaveName();
                                    setIsEditing(false);
                                }
                                }
                                text={"Save Name"}
                            />
                            {/* <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    handleSaveName();
                                    setIsEditing(false);
                                }}
                                disabled={!userName}
                            >
                                Save
                            </Button> */}
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
                marginBottom: "2%"
            }}>
                <GloriousButton
                    id="play-ai-button"
                    onClick={!storedName || networkError ? null : handleStartAiPlay}
                    text={'Play with AI'}
                    color="darkblue"
                />
                <GloriousButton
                    id="play-online-button"
                    onClick={!storedName || coinBalance < 100 || networkError ? null : handleStartGame}
                    text={'Start Online'}
                    color="orange"
                />
                <GloriousButton
    id="room-session-button"
    onClick={!storedName || networkError ? null : () => setRoomModalOpen(true)}
    text={'Room Session'}
    color="darkblue"
/>

<RoomSessionModal
    open={roomModalOpen}
    onClose={() => setRoomModalOpen(false)}
    onJoin={(roomId) => {
        handleJoinRoom(roomId);
        setRoomModalOpen(false);
    }}
    onCreate={() => {
        handleCreateGame();
        setRoomModalOpen(false);
    }}
/>

                {/* <GloriousButton

                    onClick={!storedName || networkError ? null : handleCreateGame}
                    text={'Create Room'}
                    color="darkblue"
                />
                <GloriousButton
                    id="play-room-button"
                    onClick={!storedName || networkError ? null : handleJoinRoom}
                    text={'Join Room'}
                    color="darkblue" */}
                {/* /> */}
                {/* <Button
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
                </Button>*/}
            </Box>
            <Box
                sx={{
                    textAlign: "center",
                    color: "#fff",
                    fontSize: "1rem",
                    marginBottom: "2%",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    backdropFilter: "blur(5px)",
                    maxWidth: "80%",
                    mx: "auto",
                }}
            >
                {getRandomProTip()}
                {/* 💡 Pro Tip: Win games to earn more coins and climb the leaderboard! */}
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
            <Dialog
                open={!authenticated}
                onClose={() => setAuthenticated(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #1f1c2c, #928dab)',
                        color: 'white',
                        padding: 2,
                        boxShadow: '0px 0px 20px #000',
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', fontSize: '1.5rem' }}>
                    <SportsEsportsIcon fontSize="large" />
                    Enter the Arena
                </DialogTitle>

                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        ⚠️ <strong>Coins</strong> can only be used after you log in. Choose your path:
                    </Typography>

                    <Stack spacing={2}>
                        <FacebookLogin onLogin={handleFacebookLogin} />

                        <Button
                            variant="outlined"
                            onClick={handleGuestLogin}
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                            fullWidth
                        >
                            Continue as Guest
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Home;
