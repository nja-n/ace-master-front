import { NotificationsActiveSharp, Task } from "@mui/icons-material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
    Badge,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    keyframes,
    Stack,
    Typography,
    useMediaQuery
} from "@mui/material";
import { HelpCircleIcon, HomeIcon, InfoIcon, PersonStandingIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FirebaseLogin from "../components/FirebaseLogin";
import { useLoading } from "../components/LoadingContext";
import { getRandomProTip } from "../components/Utiliy";
import InstallPrompt from "../components/force/need/Promote";
import { createUniqueRoom, validateUniqueRoom } from '../components/methods';
import GameTutorial from "../components/tutorial/GameTutorial";
import CustomAvatar from "../components/ui/CustomAvathar";
import ImageIcon from "../components/ui/CustomImageIcon";
import GloriousButton from "../components/ui/GloriousButton";
import RoomSessionModal from "../components/ui/RoomSession";
import { useUser } from "../components/ui/UserContext";
import { apiClient } from "../components/utils/ApIClient";
import { emit } from "../components/utils/eventBus";
import { NotificationListDialog } from "./fragments/NotificationListDialog";
import { SettingsDialog } from "./fragments/SettingsDialog";
import Login from "../components/Login";

const Home = () => {
    const { user, loading } = useUser();
    const { setLoading } = useLoading();

    const [storedId, setStoredId] = useState("");

    const navigate = useNavigate();

    const [installProm, setInstallProm] = useState(false);
    const [roomIdInput, setRoomIdInput] = useState('');

    const [coinBalance, setCoinBalance] = useState(0);

    const [authenticated, setAuthenticated] = useState(true);

    const [tutorialSeen, setTutorialSeen] = useState(true);

    const [roomModalOpen, setRoomModalOpen] = useState(false);

    const [notification, setNotification] = useState(false);

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
                backgroundSize: "contain",       // Show full image without cutting
                backgroundPosition: "top",    // Center the image
                height: "calc(100vh - 120px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
            }}
        >
            {!tutorialSeen && authenticated
                && <GameTutorial joyrideRef={0} sceneNum={1} />}

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
                    <br />
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
                >
                    <Typography
                        onClick={() => alert(`There are currently ${user?.onlineCount ?? 0} players enjoying this game!`)}
                    >
                        🟢 {user?.onlineCount ?? 0}
                    </Typography>

                    <br />
                    {/*<Box display={'flex'}
                        sx={{ position: 'relative' }}
                        onClick={() => setNotification(true)}
                    >
                        <Badge>2</Badge>
                        <NotificationsActiveSharp />
                        {notification && <NotificationListDialog setClose={setNotification} />}
                    </Box>*/}
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

                <Typography variant="h4" color="white" sx={{ marginTop: "10px" }}>
                    {user?.firstName}
                </Typography>

                {/* <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Button
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: "gold",
            color: "#111",
            fontWeight: "bold",
            fontSize: "18px",
            px: 4,
            py: 1.2,
            borderRadius: "30px",
            boxShadow: "0 0 20px rgba(255,215,0,0.6)",
          }}
        >
          🎮 PLAY NOW
        </Button>
      </motion.div> */}
            </Box>

            {/* Bottom Buttons */}
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                px:1,
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
                        onClick={!user?.firstName || coinBalance < 100 ? null : handleStartGame}
                        text="Start Online"
                        color="orange"
                    />

                    <GloriousButton
                        id="quick-play-button"
                        onClick={!user?.firstName ? null : handleQuickPlay}
                        text="Quick Play"
                        color="orange"
                    />

                    <GloriousButton
                        id="play-ai-button"
                        onClick={!user?.firstName ? null : handleStartAiPlay}
                        text="Bot Play"
                        color="darkblue"
                    />

                    <GloriousButton
                        id="room-session-button"
                        onClick={!user?.firstName ? null : () => setRoomModalOpen(true)}
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

                        <Login onAuthenticated={() => setAuthenticated(true)} />
                        {/* <FirebaseLogin onAuthenticated={() => setAuthenticated(true)} /> */}
                    </Stack>
                </DialogContent>
            </Dialog>
            {/* { !user?.firstName && <SettingsDialog user={user}/> } */}
        </Box>
    );
};

export default Home;
