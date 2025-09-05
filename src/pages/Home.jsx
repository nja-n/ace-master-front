import { MoreVert } from "@mui/icons-material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
    AppBar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, Menu, MenuItem,
    Stack,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../components/utils/ApIClient";
import FirebaseLogin from "../components/FirebaseLogin";
import Login from "../components/Login";
import { getDeviceInfo, getRandomProTip } from "../components/Utiliy";
import { createUniqueRoom, saveUser, validateUniqueRoom } from '../components/methods';
import GameTutorial from "../components/tutorial/GameTutorial";
import CustomAvatar from "../components/ui/CustomAvathar";
import AceMasterLogo from "../components/ui/GameLogoHeader";
import GloriousButton from "../components/ui/GloriousButton";
import RoomSessionModal from "../components/ui/RoomSession";
import { useLoading } from "../components/LoadingContext";
import { useUser } from "../components/ui/UserContext";
import CoinWithText from "./fragments/CoinWithText";
import InstallPrompt from "../components/force/Promote";

const Home = () => {
    const { user, loading } = useUser();
    const { setLoading } = useLoading();

    const [changedName, setChangedName] = useState("");
    const [userName, setUserName] = useState("");
    //const [storedName, setStoredName] = useState("");
    const [storedId, setStoredId] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const [installProm, setInstallProm] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');

    const [coinBalance, setCoinBalance] = useState(0);

    const [authenticated, setAuthenticated] = useState(storedId ? true : false);

    const [tutorialSeen, setTutorialSeen] = useState(true);

    const [roomModalOpen, setRoomModalOpen] = useState(false);

    const alreadyInstalled = isInStandaloneMode();

    useEffect(() => {
        emit("user:refresh");
    }, []);

    useEffect(() => {
        if (loading) {
            setLoading(true);
            return;
        }

        if (user && user.id) {
            setStoredId(user.id);
            setAuthenticated(true);
            setCoinBalance(user.coinBalance || -1);
            setUserName(user.firstName || "");
        } else {
            setAuthenticated(false);
        }
        setLoading(false);
    }, [user, loading]);


    useEffect(() => {
        const savedName = localStorage.getItem("gameTutorialSeen");
        if (savedName) {
            setTutorialSeen(true);
        } else {
            setTutorialSeen(false);
        }
    }, [storedId]);

    useEffect(() => {
        if (!storedId && authenticated) {
            window.location.reload();
        }
    }, [authenticated]);

    const handleChangeName = (value) => {
        const capitalizedValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
        setChangedName(capitalizedValue);
    };

    const handleSaveName = async () => {
        setLoading(true);
        const deviceInfo = await getDeviceInfo();
        try {
            const payload = {
                id: storedId,
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
            });

            if (!response) throw new Error("Failed to save user");

            const data = await response;

            setStoredId(data.id)
            setUserName(data.firstName);
            alert('Player Name have been saved.');

        } catch (error) {
            alert('something went wrong, please try again');
            console.error("Error saving user:", error);
            setLoading(false);
        }
        setLoading(false);
    };

    const handleStartGame = async () => {
        if (coinBalance < 100) {
            alert('You do not have enough coins to play. Please earn more coins by completing tasks.');
            return;
        }

        const confirmed = await window.confirm(
            "Starting a game will cost you 100 coins. Do you want to proceed?"
        );

        if (confirmed) {
            navigate("/game");
        }
    };



    const handleCreateGame = async () => {
        if (await window.confirm("Are you ready to create a Room?")) {
            try {
                const response = await apiClient(createUniqueRoom);

                const roomId = response;
                navigate(`/game/${roomId}`);
            } catch (error) {
                console.error("Error creating room:", error);
                alert("Failed to create room. Please try again.");
            }
        }
    };

    const handleJoinRoom = (roomNumber) => {
        handlePlay(roomNumber);
    }

    const handlePlay = async (roomNumber) => {
        let trimmedRoomId = roomIdInput.trim();
        trimmedRoomId = trimmedRoomId ? trimmedRoomId : roomNumber;

        if (trimmedRoomId === '') {
            setRoomIdInput('');
            alert('Please enter a valid Room ID');
            return;
        }
        else {
            alert("Joining Room ID: " + trimmedRoomId);
        }

        try {
            const response = await apiClient(validateUniqueRoom, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ roomId: trimmedRoomId }),
            });
            const result = response.status;

            if (result === 'Y') {
                navigate(`/game/${trimmedRoomId}`);
                setRoomIdInput('');
            } else {
                alert('Room ID not found or inactive.');
            }
        } catch (error) {
            alert('An error occurred while validating the Room ID.');
        }
    };

    const handleMenuSelected = (i) => {
        switch (i) {
            case 1:
                navigate('/tasks');
                break;
            case 2:
                navigate('/about');
                break;
            case 4:
                navigate('/contact');
                break;
            case 3:
                window.location.href = "mailto:aeither.dev@hotmail.com?subject=Contact Request&body=Hello, I need assistance with...";
                break;
            case 5:
                navigate('/ranking');
                break;
            case 6:
                setInstallProm(true);
                break;
            default:
                alert('Please select correct action');
        }
    };

    const handleStartAiPlay = async () => {
        if (await window.confirm('Are you ready to play with AI?')) {
            navigate("/game/ai");
        }
    }

    return (
        <Box
            sx={{
                //backgroundColor: "#2e7d32",
                //backgroundImage: `url(${bgGreenTable})`,
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
                    <AceMasterLogo />

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CoinWithText coinBalance={coinBalance} />

                        {/* Desktop Buttons */}
                        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
                            {/* <Button color="inherit" onClick={() => handleMenuSelected(1)}>Chat</Button> */}
                            <Button color="inherit" onClick={() => handleMenuSelected(1)}>Task</Button>
                            <Button color="inherit" onClick={() => handleMenuSelected(5)}>Leaderboard</Button>
                            <Button color="inherit" onClick={() => handleMenuSelected(2)}>About</Button>
                            {!alreadyInstalled && false && <Button color="inherit" onClick={() => handleMenuSelected(6)}>Install App</Button>}
                            {/* <Button color="inherit" onClick={() => handleMenuSelected(4)}>Contact Us</Button> */}
                        </Box>

                        {/* Mobile Menu */}
                        <IconButton edge="end" color="inherit" onClick={handleMenuOpen} sx={{ display: { xs: "block", sm: "none" } }}>
                            <MoreVert color="gold"/>
                        </IconButton>

                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            <MenuItem onClick={() => { handleMenuSelected(1); handleMenuClose(); }}>Task</MenuItem>
                            <MenuItem onClick={() => { handleMenuSelected(5); handleMenuClose(); }}>Leaderboard</MenuItem>
                            <MenuItem onClick={() => { handleMenuSelected(2); handleMenuClose(); }}>About</MenuItem>
                            {/* <MenuItem onClick={() => { handleMenuSelected(4); handleMenuClose(); }}>Contact Us</MenuItem> */}
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
                        size={200} letter={(user?.firstName)?.charAt(0).toUpperCase() || "?"}
                    />
                </Box>

                {userName && !isEditing ? (
                    <>
                        <Typography variant="h4" color="white" sx={{ marginTop: "10px" }}>
                            {userName}
                        </Typography>
                        {/* <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}>
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => {
                                    setIsEditing(true);
                                    setChangedName(user?.firstName);
                                }}
                            >
                                Edit
                            </Button>
                        </Box> */}
                    </>
                ) : (
                    <Box sx={{ marginTop: "20px", textAlign: "center" }}>
                        <TextField
                            id="name-input"
                            value={changedName}
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
                            {user?.firstName && (
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setChangedName(""); // or revert to storedName
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
                    onClick={!userName ? null : handleStartAiPlay}
                    text={'Play with AI'}
                    color="darkblue"
                />
                <GloriousButton
                    id="play-online-button"
                    onClick={!userName || coinBalance < 100 ? null : handleStartGame}
                    text={'Start Online'}
                    color="orange"
                />
                <GloriousButton
                    id="room-session-button"
                    onClick={!userName ? null : () => setRoomModalOpen(true)}
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
                    value={roomIdInput}
                />
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

            <Dialog open={installProm} onClose={() => setInstallProm(false)}>
                <DialogTitle>
                    Install Ace Master App
                </DialogTitle>
                <DialogContent>
                    <InstallPrompt />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInstallProm(false)}>Cancel</Button>
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

                        {/* <Login onAuthenticated={() => setAuthenticated(true)} /> */}

                        {/* <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            OR
                        </Box> */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            <FirebaseLogin onAuthenticated={() => setAuthenticated(true)} />
                        </Box>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Home;

function isInStandaloneMode() {
    return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true // For iOS Safari
    );
}
