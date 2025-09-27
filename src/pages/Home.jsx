import { EmojiEventsOutlined, MoreVert, Task } from "@mui/icons-material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
    AppBar,
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton, keyframes, Menu, MenuItem,
    Paper,
    Stack,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery
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
import { emit } from "../components/utils/eventBus";
import ImageIcon from "../components/ui/CustomImageIcon";
import HamburgerArrow from "./fragments/Header";
import { HelpCircleIcon, HomeIcon, InfoIcon, PersonStandingIcon } from "lucide-react";

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

    const [authenticated, setAuthenticated] = useState(true);

    const [tutorialSeen, setTutorialSeen] = useState(true);

    const [roomModalOpen, setRoomModalOpen] = useState(false);

    const [openMenu, setOpenMenu] = useState(false);
    const isMobile = useMediaQuery("(max-width:600px)");


    const menuItems = [
        { icon: <HomeIcon />, label: "Home", onClick: () => navigate("/") },
        { icon: <PersonStandingIcon />, label: "Profile", onClick: () => navigate("/profile") },
        { icon: <Task />, label: "Tasks", onClick: () => navigate("/tasks") },
        { icon: <InfoIcon />, label: "About", onClick: () => navigate("/about") },
        { icon: <HelpCircleIcon />, label: "FAQ", onClick: () => navigate("/faq") },
    ];

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
            navigate("/play/classic");
        }
    };



    const handleCreateGame = async () => {
        if (await window.confirm("Are you ready to create a Room?")) {
            try {
                const response = await apiClient(createUniqueRoom);

                const roomId = response;
                navigate(`/play/${roomId}`);
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
        } else {
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
                navigate(`/play/${trimmedRoomId}`);
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
            // navigate("/game/ai");
            navigate("/play/bot");
        }
    }

    const handleQuickPlay = async () => {
        if (await window.confirm('Are you ready for a battle?')) {
            // navigate("/game/ai");
            navigate("/play/quick");
        }
    }

    const pulse = keyframes`
  0% { transform: scale(1); color: gold; }
  50% { transform: scale(1.2); color: orange; }
  100% { transform: scale(1); color: gold; }
`;


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

                        {isMobile ? (
                            <HamburgerArrow open={openMenu} onClick={() => setOpenMenu((prev) => !prev)} />
                        ) : (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                {menuItems.map((item) => (
                                    <Box
                                        key={item.label}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            color: "Home" !== item.label ? "gold" : "lightgray",
                                        }}
                                        onClick={item.onClick}
                                    >
                                        {item.icon}
                                        <Typography variant="caption">{item.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}

                    </Box>
                </Toolbar>
                {isMobile && (
                    <Collapse in={openMenu}>
                        <Paper elevation={3}
                            sx={{
                                background: "linear-gradient(135deg, rgba(30,41,59,0.55), rgba(51,65,85,0.55))",
                                color: "gold"
                            }}>
                            <Box sx={{ display: "flex", justifyContent: "space-around", py: 1 }}>
                                {menuItems.map((item) => (
                                    <Box
                                        key={item.label}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            color: "Home" !== item.label ? "gold" : "lightgray",
                                        }}
                                        onClick={() => {
                                            item.onClick();
                                            setOpenMenu(false);
                                        }}
                                    >
                                        {item.icon}
                                        <Typography variant="caption">{item.label}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Collapse>
                )}
            </AppBar>

            {/* User Info */}
            <Box sx={{ textAlign: "center", marginTop: "20px", position: "relative", width: "100%" }}>
                <Box
                    sx={{
                        position: "absolute",
                        top: 8,
                        left: 16,
                        animation: `${pulse} 1.5s infinite ease-in-out`,
                        cursor: "pointer"
                    }}
                    onClick={() => console.log("Go to leaderboard")} // replace with navigation
                >
                    <ImageIcon icon="leader" onclick={() => navigate("ranking")} />
                        <br/>
                    {/* <ImageIcon icon="cart" onclick={() => navigate("payment")}/> */}
                </Box>

                {/* Top Right: Online Count */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        color: "gold",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer"
                    }}
                    onClick={() => alert(`There are currently ${user?.onlineCount ?? 0} players enjoying this game!`)}
                >
                    🟢 {user?.onlineCount ?? 0}
                </Box>


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
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr", // two equal columns
                        gap: "16px", // spacing between buttons
                        maxWidth: "400px", // optional: control overall width
                        margin: "0 auto" // center in parent
                    }}
                >

                    <GloriousButton
                        id="play-online-button"
                        onClick={!userName || coinBalance < 100 ? null : handleStartGame}
                        text="Start Online"
                        color="orange"
                    />

                    <GloriousButton
                        id="quick-play-button"
                        onClick={!userName ? null : handleQuickPlay}
                        text="Quick Play"
                        color="orange"
                    />

                    <GloriousButton
                        id="play-ai-button"
                        onClick={!userName ? null : handleStartAiPlay}
                        text="Play with Bot"
                        color="darkblue"
                    />

                    <GloriousButton
                        id="room-session-button"
                        onClick={!userName ? null : () => setRoomModalOpen(true)}
                        text="Room Session"
                        color="darkblue"
                    />

                </div>


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
                        <FirebaseLogin onAuthenticated={() => setAuthenticated(true)} />
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Home;
