import logo from '../images/back_thumb.jpg';

import React, { useState, useEffect, useRef } from "react";
import {
    Box, Grid, Typography, Avatar, Card, CardContent,
    Button, CardMedia, LinearProgress, CircularProgress,
    Snackbar, SnackbarContent, AppBar, Toolbar, IconButton
} from "@mui/material";
import { game, getTimeRemains } from '../components/methods';
import { useNavigate, useParams } from "react-router-dom";
import { Refresh, ArrowBack } from "@mui/icons-material";

// import { motion, AnimatePresence } from "framer-motion";

import shuffleSound from '../assets/sounds/riffle-card-shuffle.mp3';
import selectSound from '../assets/sounds/card-sounds-select.mp3';
import placeSound from '../assets/sounds/card-sound-push.mp3';
import flipCard1 from '../assets/sounds/flip-card.mp3';
import flipCard2 from '../assets/sounds/page-flip.mp3';

export default function GameTable() {
    const ws = useRef(null);

    const [gameData, setGameData] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [playerName, setPlayerName] = useState(null);
    const [playerId, setPlayerId] = useState(null);

    const [timeLeft, setTimeLeft] = useState(15);

    const [snackbar, setSnackbar] = useState({ open: false, message: null });
    
    const {roomId} = useParams();
    
    const navigate = useNavigate();

    // const [movingCard, setMovingCard] = useState(null);
    // const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    // const cardRefs = useRef([]);

    const audioShuffle = useRef(new Audio(shuffleSound));
    const audioPlace = useRef(new Audio(selectSound));
    const audioSelect = useRef(new Audio(placeSound));
    const audioFlip1 = useRef(new Audio(flipCard1));
    const audioFlip2 = useRef(new Audio(flipCard2));

    useEffect(() => {
        let playerNameLocal = localStorage.getItem("userName");
        let playerIdLocal = localStorage.getItem("userId");

        setPlayerName(playerNameLocal);
        setPlayerId(playerIdLocal);

        ws.current = new WebSocket(`${game}?playerId=${playerIdLocal}${roomId ? '&roomId=' + roomId : ''}`);

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

    }, []);

    /*useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);*/

    useEffect(() => {
        /*if (gameData) {
            setCurrentTurn(gameData.turnIndex);
            setTimeLeft(15);
        }*/
        if (gameData?.sessionId) {
            let url = getTimeRemains.replace('SESSION_ID', gameData.sessionId);
            fetch(url)
                .then((res) => res.json())
                .then((time) => setTimeLeft(time));
        }
        if (gameData && gameData?.turnIndex >= 0) {
            const interval = setInterval(() => {
                let url = getTimeRemains.replace('SESSION_ID', gameData.sessionId);
                if (gameData?.sessionId) {
                    fetch(url)
                        .then((res) => res.json())
                        .then((time) => {
                            setTimeLeft(time);
                            if(time < 1){
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

    if (!gameData) {
        return <Typography color="white">Loading...</Typography>;
    }
    let { players, tableCards, closedCards } = gameData;

    const clientPlayer = gameData.clientPlayer;

    players = players.filter(player => !player.client);


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
            <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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

                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Ace Master
                        </Typography>

                        {/* Refresh Button */}
                        <IconButton color="inherit" onClick={() => window.location.reload()}>
                            <Refresh />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Centered Game Over Content */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h4" color="white">Game Over</Typography>
                    {gameData.players && gameData.players.map((player, i) => (
                        <Typography variant="h6" cosx={{
                            color: player.winningRank === 0 ? 'red' : 'green'
                          }}
                        >{getOrdinalSuffix(player.winningRank)} : {player.firstName}</Typography>
                    ))}

                    {/* <Typography variant="h6" color="red">Loser: {gameData.looserPlayer.firstName}</Typography> */}

                    <Box mt={3} display="flex" gap={2}>
                        <Button variant="contained" color="primary" onClick={handleResetGame}>
                            Start Again
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>
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
                    backgroundColor: "#2e7d32",
                    //padding: 2,
                }}
            >
                <AppBar position="static" sx={{ backgroundColor: "#1b5e20", width: "100%" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        {/* Back Button */}
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => navigate("/")}
                        >
                            <ArrowBack />
                        </IconButton>

                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Ace Master
                        </Typography>

                        {/* Refresh Button */}
                        <IconButton color="inherit" onClick={() => window.location.reload()}>
                            <Refresh />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {/* Opponent Players */}
                <Grid container justifyContent="center" spacing={10} sx={{ padding: 2 }}>
                    {players.map((player) => (
                        <Grid item key={player.id} textAlign="center">
                            <Box position="relative" display="inline-flex">
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
                            </Box>
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
                    backgroundColor: "#2e7d32",
                    //padding: 2,
                }}>
                    <Box display="flex" gap={1} sx={{ flexDirection: "column" }}>
                        {/* <Typography color="white" variant="h6">Closed Cards</Typography> */}
                        <Card sx={{ width: 50, height: 80, backgroundColor: "white" }}>
                            {/* <CardContent sx={{ fontSize: 24, textAlign: "center" }}>{timeLeft}</CardContent> */}
                            <CardContent sx={{ fontSize: 24, textAlign: "center" }}>
                                {closedCards ? closedCards.length : 'X'}
                                <Box sx={{ fontSize: 10 }}>Nos</Box>
                            </CardContent>
                        </Card>
                    </Box>
                    <Box>
                        {/* <Typography color="white" variant="h6">Played Cards</Typography> */}
                        <Box display="flex" gap={1} position='relative'>
                            {/* <AnimatePresence>
                                {movingCard && (
                                    <motion.div
                                    initial={{ x: startPos.x, y: startPos.y, opacity: 1 }}
                                        animate={{ x: 100, y: 0, opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        style={{ position: "absolute" }}
                                    >
                                        <Card sx={{ width: 50, height: 80, backgroundColor: "white" }}>
                                            <CardContent sx={{ fontSize: 24, textAlign: "center", color: movingCard.color }}>
                                                {movingCard.cardLabel}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence> */}
                            {tableCards && tableCards.map((card, i) => (
                                <Card key={i} sx={{ width: 50, height: 80, backgroundColor: "white" }}>
                                    <CardContent sx={{ fontSize: 24, textAlign: "center", color: card.color }}>{card.cardLabel}</CardContent>
                                </Card>
                            ))}
                            {gameData.roomId && gameData.turnIndex < 0 &&
                                <Typography color="white" variant="h6">Room Number : {gameData.roomId}</Typography>
                            }
                        </Box>
                    </Box>
                </Box>

                {/* Client Player (User) */}
                <Box textAlign="center" sx={{ padding: 2 }} gap={1} display="flex" flexDirection="column">
                    <Typography color="white" variant="h6">
                        {selectedCard !== null && (//Your Cards
                            <Box >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handlePlayCard()}
                                >
                                    Place
                                </Button>
                            </Box>
                        )}
                    </Typography>
                    <Typography color="white" variant="h6">
                        {!clientPlayer.sorted && gameData.turnIndex >= 0 && (
                            <Box >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleSortCard()}
                                >
                                    Sort
                                </Button>
                            </Box>
                        )}
                    </Typography>
                    <Typography color="white" variant="h6">
                        {gameData.turnIndex < 0 && (
                            <Box display="flex" flexDirection="column" alignItems="center" width="100%">
                                {gameData.countDown === 0 ||  gameData.countDown === '0'? (
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Finding Opponents... ({gameData.players.length} / {gameData.maxPlayers})
                                    </Typography>
                                ) : (
                                    <Typography variant="body1" sx={{ mb: 1 }}>
                                        Starts in... ({gameData.countDown} Sec)
                                    </Typography>
                                )}

                                <Box width="60%">
                                    <LinearProgress color="info" />
                                </Box>
                            </Box>
                        )}
                    </Typography>
                    <Typography color="white" variant="h6">
                        {gameData.turnIndex < 0 && gameData.players.length > 2 && (
                            <Box >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleStartGame()}
                                >
                                    Start
                                </Button>
                            </Box>
                        )}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
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
                                }}>
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
                        <Grid item display="flex" flexDirection="column" alignItems="center">
                            <Box position="relative" display="inline-flex">
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
                                                color:  timeLeft>5 ? 'white' :'red'
                                            }}
                                        >
                                            {timeLeft > 0 ? timeLeft : playerName.slice(0, 1)}
                                        </Avatar>
                                    </>
                                ) : (
                                    <Avatar sx={{ width: 64, height: 64, bgcolor: "#ffcc00" }}>{clientPlayer.winningRank
                                        ? getOrdinalSuffix(clientPlayer.winningRank)
                                        : playerName.charAt(0)}</Avatar>
                                )}
                            </Box>
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

const getCardImage = (imageName) => {
    try {
        return require(`../images/cards/${imageName}`);
    } catch (error) {
        return require(`../images/cards/default_card.jpg`); // Fallback
    }
};

const cardStyles = {
    width: 56,
    height: 80,
    //backgroundColor: "gray",
    position: "absolute",
};

function getOrdinalSuffix(rank) {
    if(rank == 0) {
        return 'Looser';
    }
    const j = rank % 10,
        k = rank % 100;
    if (j === 1 && k !== 11) {
        return `🥇 ${rank}st`;
    }
    if (j === 2 && k !== 12) {
        return `🥈 ${rank}nd`;
    }
    if (j === 3 && k !== 13) {
        return `🥉 ${rank}rd`;
    }
    return `${rank}th`;
}


