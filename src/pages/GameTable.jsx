import logo from '../images/back_thumb.jpg';

import { ArrowBack, QuestionMark, Refresh, Share } from "@mui/icons-material";
import {
    AppBar,
    Box,
    Button,
    Card, CardContent,
    CardMedia,
    Grid,
    IconButton,
    LinearProgress,
    Snackbar, SnackbarContent,
    Toolbar,
    Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { game, gameAi, getTimeRemains, userByToken } from '../components/methods';

// import { motion, AnimatePresence } from "framer-motion";

import placeSound from '../assets/sounds/card-sound-push.mp3';
import selectSound from '../assets/sounds/card-sounds-select.mp3';
import flipCard1 from '../assets/sounds/flip-card.mp3';
import flipCard2 from '../assets/sounds/page-flip.mp3';
import shuffleSound from '../assets/sounds/riffle-card-shuffle.mp3';
import audioWinFile from '../assets/sounds/win.mp3';
import fireConfetti, { ConfettiSideCannons } from '../components/custom-fire-confetti';
import GameTutorial from '../components/tutorial/GameTutorial';
import AceMasterLogo from '../components/ui/GameLogoHeader';
import GloriousButton from '../components/ui/GloriousButton';
import PlayerAvatarWithTimer from '../components/ui/PlaterWithAvatar';
import { apiClient } from '../components/utils/ApIClient';
import bgGreenTable from '../images/bg-green-table.png';

export default function GameTable() {
    const ws = useRef(null);

    const [gameData, setGameData] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [playerName, setPlayerName] = useState(null);
    const [playerId, setPlayerId] = useState(null);

    const [timeLeft, setTimeLeft] = useState(15);

    const [snackbar, setSnackbar] = useState({ open: false, message: null });


    const [joyrideRef, setJoyrideRef] = useState(0);

    const { roomId } = useParams();

    const navigate = useNavigate();

    // const [movingCard, setMovingCard] = useState(null);
    // const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    // const cardRefs = useRef([]);

    const audioShuffle = useRef(new Audio(shuffleSound));
    const audioPlace = useRef(new Audio(selectSound));
    const audioSelect = useRef(new Audio(placeSound));
    const audioFlip1 = useRef(new Audio(flipCard1));
    const audioFlip2 = useRef(new Audio(flipCard2));
    const audioWin = useRef(new Audio(audioWinFile));

    const celebratedWinners = useRef(new Set());

    const pressTimer = useRef(null);
    const lastTapRef = useRef(0);

    useEffect(() => {
        (async () => {
            let player = await apiClient(userByToken, {
                method: "POST",
            });
            setPlayerName(player.firstName);
            setPlayerId(player.id);
        })();
    }, []);

    useEffect(() => {
        if (!playerId) return;
        console.log("Connecting to WebSocket...", playerId);
        if (roomId && isNaN(roomId)) {
            ws.current = new WebSocket(`${gameAi}?playerId=${playerId}`);
        } else {
            ws.current = new WebSocket(`${game}?playerId=${playerId}${roomId ? '&roomId=' + roomId : ''}`);
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setGameData(data);
        };
        ws.onopen = () => {
            console.log("WebSocket connection established.");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error: ", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        return () => {
            ws.current.close();
        };
    }, [playerId]);

    useEffect(() => {
        if (gameData?.sessionId) {
            let url = getTimeRemains.replace('SESSION_ID', gameData.sessionId);
            fetch(url)
                .then((res) => res.json())
                .then((time) => setTimeLeft(time));
        }
        if (gameData && gameData?.turnIndex >= 0 && gameData.looserPlayer == null) {
            if (gameData.turnIndex === gameData.clientPlayer.gameIndex) {
                audioFlip2.current.play().catch((err) => {
                    console.warn("Failed to play sound:", err);
                });
            }

            const interval = setInterval(() => {
                let url = getTimeRemains.replace('SESSION_ID', gameData.sessionId);
                if (gameData?.sessionId) {
                    fetch(url)
                        .then((res) => res.json())
                        .then((time) => {
                            setTimeLeft(time);
                            if (time < 1) {
                                if (gameData?.turnIndex === gameData.clientPlayer.gameIndex) {
                                    setSnackbar({ open: true, message: "Time Out!" });
                                    audioPlace.current.play().catch((err) => {
                                        console.warn("Failed to play sound:", err)
                                    });
                                }
                                setSelectedCard(null);
                            }
                        });
                }
            }, 1000);
            return () => clearInterval(interval);
        }

    }, [gameData?.turnIndex]);

    useEffect(() => {
        if (gameData?.countDown === 3) {
            audioShuffle.current.play().catch((err) => {
                console.warn("Failed to play sound:", err);
            });
        }
    }, [gameData?.countDown]);

    useEffect(() => {
        if (selectedCard !== null) {
            audioFlip1.current.play().catch((err) => {
                console.warn("Failed to play sound:", err);
            });
        }
    }, [selectedCard]);

    useEffect(() => {
        if (gameData?.players.length > 0) {
            gameData.players.forEach(player => {
                if (player.winningRank && !celebratedWinners.current.has(player.id)) {
                    const rank = getOrdinalSuffix(player.winningRank);

                    ConfettiSideCannons();
                    fireConfetti();
                    celebratedWinners.current.add(player.id);

                    audioWin.current.play().catch((err) => {
                        console.warn("Failed to play sound:", err);
                    });
                }
            });
        }
        if (gameData?.turnIndex < -1) {
            celebratedWinners.current.clear();
        }
    }, [gameData?.players]);

    if (!gameData) {
        return <Typography color="white">Loading...</Typography>;
    }
    let { players, tableCards, closedCards } = gameData;

    const clientPlayer = gameData.clientPlayer;
    players = players.filter(player => !player.client);

    const handleTouchStart = (index, canPlay) => {
        handleCardClick(index, canPlay);
        pressTimer.current = setTimeout(() => {
            // Long press detected
            if (canPlay) handlePlayCard(index);
        }, 600); // long press threshold (ms)
    };

    const handleTouchEnd = (index, canPlay) => {
        clearTimeout(pressTimer.current);

        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300;

        if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
            // Double tap detected
            if (canPlay) {
                handlePlayCard(index);
            }
        } else {
            // Single tap fallback
            handleCardClick(index, canPlay);
        }

        lastTapRef.current = now;
    };

    const handleCardClick = (index, canPlay) => {
        if (gameData.turnIndex === clientPlayer.gameIndex) {
            if (canPlay) {
                setSelectedCard(index === selectedCard ? null : index); // Toggle selection
            } else {
                setSnackbar({ open: true, message: "You Already Have Cards!" });
            }
        } else {
            setSnackbar({ open: true, message: "Wait for Your Turn.!" });
        }
    };

    const handlePlayCard = () => {
        if (selectedCard !== null) {
            let selectedCardValue = clientPlayer.cards[selectedCard].id;

            /**let selectedCardData = clientPlayer.cards[selectedCard];
            setMovingCard(selectedCardData);
            if (cardRefs.current[selectedCard]) {
                const rect = cardRefs.current[selectedCard].getBoundingClientRect();
                setStartPos({ x: rect.left, y: rect.top });
            }
            // Send data to backend after animation delay
            setTimeout(() => {
                ws.current.send(JSON.stringify({ way: "push", player: playerId, card: selectedCardValue }));
                setMovingCard(null); // Clear animation after sending to backend
            }, 800);*/
            ws.current.send(JSON.stringify({ way: "push", player: playerId, card: selectedCardValue }));
            audioPlace.current.play().catch((err) => {
                console.warn("Failed to play sound:", err)
            });
            setSelectedCard(null);
        }
    };

    const handleStartGame = () => {
        ws.current.send(JSON.stringify({ way: "start" }));
        setSelectedCard(null);
        setJoyrideRef(3);
    };

    const handleResetGame = () => {
        ws.current.send(JSON.stringify({ way: "reset" }));
        setSelectedCard(null);
    };

    const snackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSortCard = () => {
        if (!clientPlayer.sorted) {
            setSelectedCard(null);
            ws.current.send(JSON.stringify({ way: "sort", player: playerId }));
        }
    };

    const hasMatchingCard = clientPlayer.cards && clientPlayer.cards.some(card => card.cardName === gameData.tableSuit);

    if (gameData.looserPlayer) {
        return (
            <Box sx={{
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#2e7d32",
                backgroundImage: `url(${bgGreenTable})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                overflow: "hidden",
            }}>
                {/* AppBar at the top */}
                <AppBar position="static" sx={{ backgroundColor: "#1b5e20" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        {/* Back Button */}
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => navigate("/")}
                        >
                            <ArrowBack />
                        </IconButton>

                        <AceMasterLogo />

                        {/* Refresh Button */}
                        <IconButton color="inherit" onClick={() => window.location.reload()}>
                            <Refresh />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Centered Game Over Content */}
                <Box
                    sx={{
                        // backgroundColor: "#2e7d32",
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        px: 4,
                        py: 6,
                    }}
                >
                    <Typography variant="h3" color="white" fontWeight="bold" gutterBottom>
                        GAME OVER
                    </Typography>

                    {gameData.players && [...gameData.players]
                        .sort((a, b) => a.winningRank - b.winningRank)
                        .map((player, i) => (
                            <Typography
                                key={i}
                                variant="h6"
                                sx={{
                                    color: player.winningRank === 0 ? "#ff5252" : "#c8e6c9",
                                    fontWeight: player.winningRank === 0 ? "bold" : "medium",
                                    mt: 1,
                                }}
                            >
                                {getOrdinalSuffix(player.winningRank)} : {player.firstName ? player.firstName : "You"}
                                {player.winningAmount ? ' - ' + player.winningAmount + ' Points' : ''}

                            </Typography>
                        ))}

                    <Box mt={5} display="flex" gap={3}>
                        <GloriousButton
                            onClick={() => handleResetGame()}
                            text='Start Again'
                        />
                        {/* <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleResetGame}
                            sx={{ fontWeight: "bold" }}
                        >
                            Start Again
                        </Button> */}

                        <Button
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={() => navigate("/")}
                            sx={{ fontWeight: "bold", borderColor: "#fff", color: "#fff" }}
                        >
                            Back
                        </Button>
                    </Box>
                </Box>

            </Box>
        );

    }
    else {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    //backgroundColor: "#2e7d32",
                    //backgroundImage: `url(${bgGreenTable})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    //padding: 2,
                }}
            >
                <GameTutorial joyrideRef={joyrideRef} sceneNum={2} />

                <AppBar position="static" sx={{ backgroundColor: "#1976d200", width: "100%" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between",
                        marginLeft: '8px', marginRight: '8px',
                     }}>
                        {/* Back Button */}
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => navigate("/")}
                        >
                            <ArrowBack />
                        </IconButton>

                        <AceMasterLogo />
                        {/* <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center",fontFamily:'serif' }}>
                            Ace Master
                        </Typography> */}

                        {/* Refresh Button */}
                        <Box>
                            <IconButton color="inherit" onClick={() => setJoyrideRef(1)}>
                                <QuestionMark />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => window.location.reload()}>
                                <Refresh />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {/* Opponent Players */}
                <Grid container justifyContent="center" spacing={10} sx={{ padding: 2 }}
                    id="opponent-info">
                    {players.map((player) => (
                        <Grid item key={player.id} textAlign="center">
                            <PlayerAvatarWithTimer
                                gameData={gameData}
                                player={player}
                                timeLeft={timeLeft}
                            />
                            {/* <Box position="relative" display="inline-flex">
                                {gameData.turnIndex === player.gameIndex ? (
                                    <>
                                        <CircularProgress size={60} color="secondary"
                                            variant="determinate" value={timeLeft * 100 / 15} />
                                        <Avatar
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                bgcolor: "#ffcc00",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)"
                                            }}
                                        >
                                            {timeLeft > 0 ? timeLeft :
                                                player.winningRank ? player.winningRank : playerName.slice(0, 1)}
                                        </Avatar>
                                    </>
                                ) : (
                                    <Avatar sx={{ width: 64, height: 64, bgcolor: "#ffcc00" }}>{player.winningRank
                                        ? getOrdinalSuffix(player.winningRank)
                                        : playerName.charAt(0)}</Avatar>
                                )}
                            </Box> */}
                            <Typography color="white">{player.firstName}</Typography>
                            <Box display="flex" gap={1} sx={{ position: "relative", width: "60px", height: "90px" }}>
                                {player.cards && player.cards.map((card, i) => (
                                    <Card key={i} sx={{
                                        ...cardStyles,
                                        left: `${i * 2}px`,
                                        // paddingX: "1px"
                                    }}>
                                        {/* <CardContent></CardContent> */}
                                        <CardMedia
                                            component="img"
                                            image={logo}
                                            alt="Logo"
                                            sx={{ width: "100%", height: "100%" }}
                                        />
                                    </Card>
                                ))}
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                <Box textAlign="center" sx={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    // backgroundColor: "#2e7d32",
                    //padding: 2,
                }}>
                    <Box display="flex" gap={1} sx={{ flexDirection: "column" }} id="closed-cards">
                        {/* <Typography color="white" variant="h6">Closed Cards</Typography> */}
                        {closedCards &&
                            (
                                <Card sx={{ width: 50, height: 80, backgroundColor: "white" }}>
                                    {/* <CardContent sx={{ fontSize: 24, textAlign: "center" }}>{gameData.turnIndex}</CardContent> */}
                                    <CardContent sx={{ fontSize: 24, textAlign: "center" }}>
                                        {closedCards ? closedCards.length : 'X'}
                                        <Box sx={{ fontSize: 10 }}>Nos</Box>
                                    </CardContent>
                                </Card>
                            )}
                    </Box>
                    <Box>
                        {/* <Typography color="white" variant="h6">Played Cards</Typography> */}
                        <Box display="flex" gap={1} position='relative' id="played-cards">
                            {tableCards && tableCards.map((card, i) => (
                                <Card key={i} sx={{ width: 50, height: 80, backgroundColor: "white" }}>
                                    <CardContent sx={{ fontSize: 24, textAlign: "center", color: card.color }}>{card.cardLabel}</CardContent>
                                </Card>
                            ))}
                            {gameData.roomId && gameData.turnIndex < 0 &&
                                <Typography color="white" variant="h6"
                                    fontWeight={"bold"} sx={{ position: 'absolute', top: 0, left: 0 }}>
                                    Room Number : {gameData.roomId}

                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            const shareText = `Join my game! Room Number: ${gameData.roomId}`;
                                            const shareUrl = window.location.href;

                                            if (navigator.share) {
                                                navigator
                                                    .share({
                                                        title: "Ace Master Room",
                                                        text: shareText,
                                                        url: shareUrl,
                                                    })
                                                    .catch((err) => console.error("Share failed:", err));
                                            } else {
                                                navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
                                                alert("Room info copied to clipboard!");
                                            }
                                        }}
                                    >
                                        <Share sx={{ color: "white" }} />
                                    </IconButton>
                                </Typography>
                            }
                        </Box>
                    </Box>
                </Box>

                {/* Client Player (User) */}
                <Box textAlign="center" sx={{ padding: 2 }} gap={1} display="flex" flexDirection="column">
                    <Typography color="white" variant="h6">
                        {selectedCard !== null && (//Your Cards
                            <GloriousButton
                                onClick={() => handlePlayCard()}
                                text='PLACE'
                            />
                            // <Box >
                            //     <Button
                            //         variant="contained"
                            //         color="primary"
                            //         onClick={() => handlePlayCard()}
                            //     >
                            //         Place
                            //     </Button>
                            // </Box>
                        )}
                    </Typography>
                    <Typography color="white" variant="h6" id="sort-button">
                        {!clientPlayer.sorted && gameData.turnIndex >= 0 && (
                            <GloriousButton
                                onClick={() => handleSortCard()}
                                text='SORT'
                            />
                            // <Box >
                            //     <Button
                            //         variant="contained"
                            //         color="primary"
                            //         onClick={() => handleSortCard()}
                            //     >
                            //         Sort
                            //     </Button>
                            // </Box>
                        )}
                    </Typography>
                    <Typography color="white" variant="h6">
                        {gameData.turnIndex < 0 && (
                            <Box display="flex" flexDirection="column" alignItems="center"
                                width="100%" style={{ fontSize: 20, }}>
                                {gameData.countDown === 0 || gameData.countDown === '0' ? (
                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                        Finding Opponents... ({gameData.players.length} / {gameData.maxPlayers})
                                    </Typography>
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Starts in... ({gameData.countDown} Sec)
                                    </Typography>
                                )}

                                <Box width="60%">
                                    <LinearProgress color="inherit" />
                                </Box>
                            </Box>
                        )}
                    </Typography>
                    <Typography color="white" variant="h6" id="start-button">
                        {gameData.turnIndex < 0 && gameData.players.length > 2 && (
                            <GloriousButton onClick={() => handleStartGame()}
                                text='Start' />
                        )}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}
                        id="card-selection">
                        {clientPlayer.cards && clientPlayer.cards.map((card, i) => (
                            <Card key={i} onClick={() => handleCardClick(i, (!hasMatchingCard || gameData.tableSuit == null || card.cardName === gameData.tableSuit))}
                                sx={{
                                    width: selectedCard === i ? 80 : 56,  // Enlarged size on selection
                                    height: selectedCard === i ? 120 : 80,
                                    backgroundColor: gameData.turnIndex === clientPlayer.gameIndex
                                        && (!hasMatchingCard || gameData.tableSuit == null || card.cardName === gameData.tableSuit) ? 'white' : "gray",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease-in-out",
                                    transform: selectedCard === i ? "translateY(-10px)" : "none", // Lift up effect
                                    zIndex: selectedCard === i ? 10 : 1 // Bring to front when selected
                                }}
                                onTouchStart={() => handleTouchStart(i, (!hasMatchingCard || gameData.tableSuit == null || card.cardName === gameData.tableSuit))}
                                onTouchEnd={() => handleTouchEnd(i, (!hasMatchingCard || gameData.tableSuit == null || card.cardName === gameData.tableSuit))}
                            >
                                {/* <CardMedia
                                            component="img"
                                            image={getCardImage(card.fileName)}
                                            alt="Logo"
                                            sx={{ width: "97%", height: "99%" }}
                                        /> */}
                                {/* <img src={getCardImage(card.fileName)} alt='None'/> */}
                                <CardContent sx={{ fontSize: 24, textAlign: "center", color: card.color }}>{card.cardLabel}</CardContent>
                            </Card>
                        ))}
                    </Box>
                    <Box >
                        <Grid item display="flex" flexDirection="column" alignItems="center"
                            id="player-info" sx={{ border: '2px dashed red' }} >
                            <PlayerAvatarWithTimer
                                gameData={gameData}
                                clientPlayer={clientPlayer}
                                timeLeft={timeLeft}
                                playerName={playerName}
                                getOrdinalSuffix={getOrdinalSuffix}
                            />
                            {/* <Box position="relative" display="inline-flex">
                                {gameData.turnIndex === clientPlayer.gameIndex ? (
                                    <>
                                        <CircularProgress size={60} color="secondary"
                                            variant="determinate" value={timeLeft * 100 / 15} />
                                        <Avatar
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                bgcolor: "#ffcc00",
                                                position: "absolute",
                                                top: "50%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                color: timeLeft > 5 ? 'white' : 'red'
                                            }}
                                        >
                                            {timeLeft > 0 ? timeLeft : playerName.slice(0, 1)}
                                        </Avatar>
                                    </>
                                ) : (
                                    // <CustomAvatar/>
                                    <Avatar sx={{ width: 64, height: 64, bgcolor: "#ffcc00" }}>{clientPlayer.winningRank
                                        ? getOrdinalSuffix(clientPlayer.winningRank)
                                        : playerName.charAt(0)}</Avatar>
                                )}
                            </Box> */}
                            <Typography color="white">{playerName}</Typography>
                        </Grid>
                    </Box>
                </Box>
                <Snackbar alignItems='center'
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    open={snackbar.open}
                    onClose={snackbarClose}
                    autoHideDuration={2000} // Auto hide after 5 seconds
                >
                    <SnackbarContent
                        sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}
                        message={snackbar.message}
                    />
                </Snackbar>
            </Box>
        );
    }
}

const cardStyles = {
    width: 56,
    height: 80,
    //backgroundColor: "gray",
    position: "absolute",
};

function getOrdinalSuffix(rank) {
    if (rank == 0) {
        return 'Looser';
    }
    const j = rank % 10,
        k = rank % 100;
    if (j === 1 && k !== 11) {
        return `🥇 ${rank}st\n-`;
    }
    if (j === 2 && k !== 12) {
        return `🥈 ${rank}nd\n-`;
    }
    if (j === 3 && k !== 13) {
        return `🥉 ${rank}rd\n-`;
    }
    return `${rank}th\n-`;
}

