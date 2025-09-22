import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  LinearProgress,
  Popover,
  Typography
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, use, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { game, gameAi, getTimeRemains } from "../components/methods";
import CustomSnackbar from "../components/ui/CustomSnackBar";
import PlayerAvatarWithTimer from "../components/ui/PlaterWithAvatar";
import { Header } from "./fragments/Header";
import GloriousButton from "../components/ui/GloriousButton";
import { EmojiEmotionsOutlined } from "@mui/icons-material";
import EmojiPopover from "../components/ui/EmojiPopover";
import GameOverScreen from "./fragments/WinningScreen";

export default function GameTableDesign() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [tableCards, setTableCards] = useState([]);

  const [flyingCard, setFlyingCard] = useState(null);
  const prevTableCardsRef = useRef([]);
  const playerRefs = useRef({});
  const [collectingCards, setCollectingCards] = useState([]);
  const closedRef = useRef(null);
  const tableCardRefs = useRef([]);

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const dropRef = useRef(null);
  const [isOverDrop, setIsOverDrop] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const zValue = useRef(0); // high zIndex for dragged card


  const [gameData, setGameData] = useState(null);
  const token = localStorage.getItem("accessToken");
  const ws = useRef(null);
  const { match } = useParams();
  const [timeLeft, setTimeLeft] = useState(15);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  const [anchorPopoverEl, setAnchorPopoverEl] = useState(null);
  const [flyingEmojis, setFlyingEmojis] = useState([]);

  const [closecardFlipped, setClosecardFlipped] = useState(false);

  useEffect(() => {
    ws.current = new WebSocket(socketUrl(match));

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setGameData(data);
    };

    ws.current.onopen = () => console.log("WebSocket connected");
    ws.current.onerror = (err) => console.error("WS error", err);
    ws.current.onclose = () => console.log("WS closed");

    return () => ws.current.close();

  }, [token]);

  useEffect(() => {
    if (gameData?.sessionId) {
      let url = getTimeRemains.replace('SESSION_ID', gameData.sessionId);
      fetch(url)
        .then((res) => res.json())
        .then((time) => setTimeLeft(time));
    }
    if (gameData && gameData?.turnIndex >= 0 && gameData.looserPlayer == null) {
      if (gameData.turnIndex === gameData.clientPlayer.gameIndex) {
        scrollBottom();
        /*audioFlip2.current.play().catch((err) => {
          console.warn("Failed to play sound:", err);
        });*/
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
                  setSnackbar({ open: true, message: "Time Out!", severity: "info" });
                  // setSnackbar({ open: true, message: "Time Out!" });
                  /*audioPlace.current.play().catch((err) => {
                    console.warn("Failed to play sound:", err)
                  });*/
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
    const prevCards = prevTableCardsRef.current;
    const currentCards = gameData?.tableCards || [];
    //gameData?.tableCards?.[i]

    if (currentCards.length > prevCards.length) {
      let card = currentCards[currentCards.length - 1];
      const addedTurnIndex = card?.addedTurnIndex;

      const playerElement = playerRefs.current[addedTurnIndex];


      if (!playerElement) return;

      const playerBox = playerElement.getBoundingClientRect();
      const containerBox = containerRef.current.getBoundingClientRect();

      const top = ((playerBox.top + playerBox.height / 2 - containerBox.top) / containerBox.height) * 100;
      const left = ((playerBox.left + playerBox.width / 2 - containerBox.left) / containerBox.width) * 100;

      setFlyingCard({ card, top, left });

      setTimeout(() => {
        setTableCards((prev) => [...prev, card]); // add to table
        setFlyingCard(null);
      }, 1000);
    }
    prevTableCardsRef.current = currentCards;

  }, [gameData?.tableCards]);

  useEffect(() => {
    gameData?.players.forEach(player => {
      if (player.lastEmoji) {
        const { emoji, timestamp } = player.lastEmoji;

        setFlyingEmojis(prev => {
          const alreadyExists = prev.some(e => e.timestamp === timestamp && e.playerId === player.id);
          if (alreadyExists) return prev;
          const playerEl = playerRefs.current[player.gameIndex];
          if (!playerEl) return prev;

          const playerBox = playerEl.getBoundingClientRect();
          const containerBox = containerRef.current.getBoundingClientRect();

          const top = ((playerBox.top + playerBox.height / 2 - containerBox.top) / containerBox.height) * 100;
          const left = ((playerBox.left + playerBox.width / 2 - containerBox.left) / containerBox.width) * 100;

          const startX = left;
          const startY = top;

          return [
            ...prev,
            {
              id: `${player.id}-${timestamp}`,
              playerId: player.id,
              emoji,
              timestamp,
              startX,
              startY,
            },
          ];
        });
      }
    });

  }, [gameData?.players]);

  useEffect(() => {
    if (gameData?.cuttedIndex !== undefined && gameData?.cuttedIndex !== null) {
      if (gameData?.cuttedIndex === -1)
        startCollectAnimation();
      else if (gameData?.cuttedIndex >= 0)
        startCollectAnimation(gameData?.cuttedIndex)
      else
        setTableCards([]);
    }
  }, [gameData?.cuttedIndex]);


  const playersBefore = gameData?.players || [];
  const clientPlayer = gameData?.clientPlayer || null;
  let players = [];

  if (playersBefore.length > 0 && clientPlayer) {
    const clientIndex = playersBefore.findIndex(p => p.id === clientPlayer.id);

    if (clientIndex !== -1) {
      const rotated = [
        ...playersBefore.slice(clientIndex),
        ...playersBefore.slice(0, clientIndex),
      ];
      players = rotated.filter(p => p.id !== clientPlayer.id);
    } else {
      players = playersBefore.filter(p => p.id !== clientPlayer?.id);
    }
  }


  const handlePlayerClick = (player, e) => {
    if (!player.cards?.length || !containerRef.current) return;

    const card = player.cards[0]; // pick 1 card for demo
    const containerBox = containerRef.current.getBoundingClientRect();
    const playerBox = e.currentTarget.getBoundingClientRect();

    // get center of clicked player box relative to container
    const top = ((playerBox.top + playerBox.height / 2 - containerBox.top) / containerBox.height) * 100;
    const left = ((playerBox.left + playerBox.width / 2 - containerBox.left) / containerBox.width) * 100;

    setFlyingCard({ card, top, left });

    setTimeout(() => {
      // setTableCards((prev) => [...prev, card]); // add to table
      setFlyingCard(null);
    }, 1000);
  };

  const handleDrop = (card, info, isValid) => {
    if (!dropRef.current) return;

    const dropBox = dropRef.current.getBoundingClientRect();
    const { x, y } = info.point; // final drop position

    if (
      x >= dropBox.left &&
      x <= dropBox.right &&
      y >= dropBox.top &&
      y <= dropBox.bottom
    ) {
      if (!selectedCard) {
        setSelectedCard(card);
      }
      handlePlayCard();
    } else {
      if (draggingIndex && zValue) {
        pushBackSession("ssort");
      }
    }

    setIsOverDrop(false);

    zValue.current = draggingIndex;
    setDraggingIndex(null);
  };

  const handleDragCard = (event, info) => {
    if (!dropRef.current) return;
    const dropBox = dropRef.current.getBoundingClientRect();
    const { x, y } = info.point;

    // 👇 highlight drop zone while hovering
    if (
      x >= dropBox.left &&
      x <= dropBox.right &&
      y >= dropBox.top &&
      y <= dropBox.bottom
    ) {
      if (!isOverDrop) setIsOverDrop(true);
    } else {
      if (isOverDrop) setIsOverDrop(false);
    }

    if (draggingIndex === null) return;

    const dx = info.offset.x;
    const shift = Math.round(dx / 30);
    const newZ = draggingIndex + shift;

    if (newZ !== zValue.current) {
      zValue.current = newZ;
    }

  }

  const handleStartDrag = (index) => {
    setDraggingIndex(index);
  }

  const pushBackSession = (way) => {
    if (way === "ssort") {
      ws.current.send(JSON.stringify({
        way: way,
        player: clientPlayer.id,
        currentZ: draggingIndex,
        newZ: zValue.current,
      }));
    } else {
      ws.current.send(JSON.stringify({
        way: "emoji",
        player: clientPlayer.id,
        emoji: way,
      }));
    }
  }


  if (!gameData) {
    return <Typography color="white">Loading...</Typography>;
  }

  const snackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStartGame = () => {
    ws.current.send(JSON.stringify({ way: "start" }));
    setSelectedCard(null);
    setTableCards([]);
    //setJoyrideRef(3);
  };

  const handlePlayCard = () => {
    if (selectedCard !== null) {
      if (gameData.turnIndex === clientPlayer.gameIndex) {
        const isTurn = (!hasMatchingCard || gameData.tableSuit == null || selectedCard.cardName === gameData.tableSuit);
        if (isTurn) {
          let selectedCardValue = selectedCard.id;
          ws.current.send(JSON.stringify({ way: "push", player: clientPlayer.id, card: selectedCardValue }));
          /*audioPlace.current.play().catch((err) => {
            console.warn("Failed to play sound:", err)
          });*/
        } else {
          setSnackbar({ open: true, message: "You must follow the suit!", severity: "warning" });
        }
      } else {
        setSnackbar({ open: true, message: "It's not your turn!", severity: "warning" });
      }
      setSelectedCard(null);
    }
  };

  const handleSortCard = () => {
    if (!clientPlayer.sorted) {
      setSelectedCard(null);
      ws.current.send(JSON.stringify({ way: "sort", player: clientPlayer.id }));
    }
  };

  const handleResetGame = async () => {
    await ws.current.send(JSON.stringify({ way: "reset" }));
    if(match && match === "quick") {
      await ws.current.send(JSON.stringify({ way: "start" }));
    }
    setSelectedCard(null);
  };

  const startCollectAnimation = (playerIndex) => {
    if (!closedRef.current) return;

    let closedRect = closedRef.current.getBoundingClientRect();
    if (playerIndex != null) {
      const playerElement = playerRefs.current[playerIndex];
      closedRect = playerElement.getBoundingClientRect();
    }

    const animCards = tableCards.map((card, i) => {
      const tableRect = tableCardRefs.current[i]?.getBoundingClientRect();
      if (!tableRect) return null;

      return {
        ...card,
        from: {
          top: tableRect.top,
          left: tableRect.left,
        },
        to: {
          top: closedRect.top,
          left: closedRect.left,
        },
      };
    }).filter(Boolean);

    setCollectingCards(animCards);

    setTimeout(() => {
      setCollectingCards([]);
      setTableCards([]);
    }, 1000);
  };

  const handleEmojiInputOpen = (event) => {
    setAnchorPopoverEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorPopoverEl(null);
  };

  const handleEmojiClick = (emoji, e) => {
    pushBackSession(emoji);
  };

  const scrollBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // optional smooth scroll
      });
    }
  }

  const hasMatchingCard = clientPlayer.cards && clientPlayer.cards.some(card => card.cardName === gameData.tableSuit);

  if (gameData.looserPlayer)
    return (
      <GameOverScreen
        gameData={gameData}
        handleResetGame={handleResetGame}
      />
    );

  return (
    <Box
      ref={scrollRef}
      sx={{
        width: "100%",         // Full width
        height: "100vh",        // Full height of viewport
        // height: `calc(100vh - 86px)`,//${theme.mixins.toolbar.minHeight}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // distribute top/middle/bottom
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "auto",
      }}
    >
      <Header />
      <Box
        sx={{
          position: "absolute",
          top: "75%",
          right: 10,
          backgroundColor: "rgba(0,0,0,0.7)",
          color: "lime",
          padding: "6px 10px",
          borderRadius: "8px",
          fontSize: "12px",
          fontFamily: "monospace",
          zIndex: 0,
          opacity: 0.4,
        }}
      >
        Session ID: {gameData.sessionId}
      </Box>

      {/* Opponents Section */}
      <Box
        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",  // full width of parent
          // maxWidth: 700, 
          minHeight: "60vh", // limit height
          maxWidth: { xs: "100%", sm: 500, md: 600 }, // cap on bigger screens
          aspectRatio: {
            xs: "3/4",   // mobile (taller oval)
            sm: "4/3",   // tablet (balanced oval)
            md: "4/3",   // desktop (wider oval)
          },
          // aspectRatio: "4/3",
          background: "radial-gradient(circle, #044a2dd0, #022218cc)",
          height: "100%",          // show only 3/4 of the height
          borderRadius: "50% / 75%", // squash vertically so top looks right
          margin: "0 auto", // center horizontally
          overflow: "hidden",     //
          // clipPath: "inset(0 0 25% 0)",
        }}

      >

        {/* Players on top half circle */}
        {players.map((player, index) => {
          const total = players.length;
          const angle = total != 1 ? (index / (total - 1)) * Math.PI : 1.5707963267948966; // 0 → π (top half)
          const radius = { xs: 30, sm: 40, md: 40 }; // smaller on mobile

          return (
            <Box
              key={player.id}
              ref={(el) => (playerRefs.current[player.gameIndex] = el)}
              sx={{
                position: "absolute",
                top: `${50 - 40 * Math.sin(angle)}%`, // top half arc
                left: `${50 + 40 * Math.cos(angle)}%`,
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <PlayerAvatarWithTimer
                gameData={gameData}
                player={player}
                timeLeft={timeLeft}
              />
              <Typography color="white" fontWeight="bold" fontSize={{ xs: 10, sm: 12, md: 14 }}>
                {player.firstName}
              </Typography>
              <Box display="flex" gap={0.5}
                justifyContent="center"
                onClick={(e) => handlePlayerClick(player, e)}
                sx={{
                  position: "relative",
                  height: { xs: 30, sm: 45, md: 60 },
                  cursor: player.cards?.length ? "pointer" : "default",
                  left: "-50%",
                  transform: "translateX(-50%)",
                }}>
                {player.cards?.map((card, i) => (
                  <Card
                    key={i}
                    sx={{
                      position: "absolute",
                      width: { xs: 20, sm: 30, md: 40 },
                      height: { xs: 30, sm: 45, md: 60 },
                      backgroundColor: "gray",
                      left: `${i * 2}px`,
                    }}>
                    <CardMedia
                      component="img"
                      image={getCardImage("card-back.png")}
                      alt="Logo"
                      sx={{ width: "97%", height: "99%" }}
                    />
                  </Card>
                ))}
              </Box>
            </Box>
          );
        })}

        {/* Center Area (Pot + Table Cards) */}
        <Box
          sx={{
            position: "absolute",
            top: "80%", // slightly lower than center so players don’t overlap
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 2, md: 3 },
          }}
        >

          {gameData.turnIndex >= 0 && (
            <>
              {/* Closed Cards */}
              <Card
                ref={closedRef}
                onClick={() => setClosecardFlipped(!closecardFlipped)}
                sx={{
                  width: { xs: 40, sm: 50, md: 60 },
                  height: { xs: 60, sm: 75, md: 90 },
                  perspective: "1000px", // 👈 3D effect
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.6s",
                    transform: closecardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front (CardMedia) */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={getCardImage("card-back.png")}
                      alt="Logo"
                      sx={{ width: "97%", height: "99%" }}
                    />
                  </Box>

                  {/* Back (CardContent) */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                    }}
                  >
                    <CardContent
                      sx={{
                        fontSize: { xs: 14, sm: 18, md: 24 },
                        textAlign: "center",
                        fontWeight: "bold",
                        p: 1,
                      }}
                    >
                      {gameData?.closedCards?.length}
                      <Box sx={{ fontSize: { xs: 8, sm: 10, md: 12 } }}>Cards</Box>
                    </CardContent>
                  </Box>
                </Box>
              </Card>


              {/* Table Cards */}
              <Box display="flex" gap={{ xs: 1, sm: 1.5, md: 2 }}>
                {Array.from({ length: gameData?.players.length }).map((_, i) => {
                  const c = tableCards[i]; // slot i may or may not have a card

                  return (
                    <Card
                      key={i}
                      ref={(el) => (tableCardRefs.current[i] = el)}
                      sx={{
                        // position: "absolute",
                        width: { xs: 50, sm: 50, md: 60 },
                        height: { xs: 75, sm: 75, md: 90 },
                        border: !c ? "2px dashed rgba(0,0,0,0.2)" : "", // outline for empty slot
                        opacity: c ? 1 : 0.5,
                        zIndex: c ? 1 : 0,
                      }}
                    >
                      {c ? (
                        renderCardDesign(c, "classic")
                      ) : (
                        <Box sx={{ fontSize: { xs: 10, sm: 12, md: 14 }, color: "gray", p: 1 }}>
                          Empty
                        </Box>
                      )}
                    </Card>
                  );
                })}
              </Box>
            </>
          )}

          {/* Start and Drop Zone */}
          <Box
            ref={dropRef}
            sx={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 250,
              height: 120,
              // border: `2px dashed ${isOverDrop ? "gold" : "#fff"}`,
              borderRadius: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <motion.div
              animate={{
                scale: isOverDrop ? 1.1 : 1,
                backgroundColor: isOverDrop
                  ? "rgba(255, 215, 0, 0.2)" // gold glow
                  : "rgba(255,255,255,0.05)",
                boxShadow: isOverDrop
                  ? "0px 0px 20px rgba(255, 215, 0, 0.8)"
                  : "0px 0px 6px rgba(255,255,255,0.2)",
                borderColor: isOverDrop ? "gold" : "#fff",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                //position: "absolute",
                //bottom: 40,
                //left: "50%",
                transform: "translateX(-50%)",
                width: 250,
                height: 120,
                border: "2px dashed",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                overflow: "hidden",
              }}
            >
              {gameData.turnIndex < 0
                ? (
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    {gameData.players.length > 2 &&
                      <GloriousButton onClick={() => handleStartGame()}
                        text='Start' />
                    }
                    <Box display="flex" flexDirection="column" alignItems="center"
                      width="100%" style={{ fontSize: 20, }}>
                      {gameData.countDown === 0 || gameData.countDown === '0' ? (
                        <>
                          {gameData.roomId !== null ? (
                            <Box display="flex" flexDirection="column" alignItems="center"
                              width="100%" style={{ fontSize: 20, }}>
                              <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                Room Id {gameData.roomId}
                              </Typography>
                            </Box>
                          ) :
                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                              Finding Opponents... ({gameData.players.length} / {gameData.maxPlayers})
                            </Typography>}
                        </>
                      ) : (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          Starts in... ({gameData.countDown} Sec)
                        </Typography>
                      )}

                      <Box width="60%">
                        <LinearProgress color="inherit" />
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Typography>
                    {isOverDrop ? "✨ Release to Drop!" : "Drop Here"}
                  </Typography>
                )}
            </motion.div>
          </Box>
        </Box>
        {/* Flying Card Animation */}
        <AnimatePresence>
          {flyingCard && (
            <motion.div
              initial={{ top: `${flyingCard.top}%`, left: `${flyingCard.left}%` }}
              animate={{ top: "70%", left: "50%" }} // table center
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              style={{
                position: "absolute",
                width: 50,
                height: 70,
                background: "white",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {renderCardDesign(flyingCard.card, "classic")}
            </motion.div>
          )}
          {flyingEmojis.map(({ id, emoji, startX, startY }) => (
            <motion.div
              key={`emoji-${id}`}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: [1, 1, 0],
                top: '70%',
                left: '50%',
                scale: [1, 1.3, 1],
                rotate: Math.random() * 30 - 15,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: `${startY}%`,
                left: `${startX}%`,
                transform: "translateX(-50%)",
                fontSize: 40,
                pointerEvents: "none",
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>
        {collectingCards.map((card) => (
          <motion.div
            key={card.id}
            initial={{
              top: card.from.top - containerRef.current?.getBoundingClientRect().top,
              left: card.from.left - containerRef.current?.getBoundingClientRect().left,
              rotateY: 0,
              position: "absolute",
            }}
            animate={{
              top: card.to.top - containerRef.current?.getBoundingClientRect().top,
              left: card.to.left - containerRef.current?.getBoundingClientRect().left,
              rotateY: 180,
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ pointerEvents: "none" }}
          >
            {renderCardDesign(card, "classic")}
          </motion.div>
        ))}

        <Box
          ref={(el) => (playerRefs.current[clientPlayer.gameIndex] = el)}
          sx={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 30,
            height: 30,
            border: "2px dashed #fff",
            borderRadius: "12px",
            backgroundColor: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >

        </Box>
      </Box>

      {/* Bottom, Section*/}
      <Box
        position="relative"
        textAlign="center"
        sx={{
          // p: 2,
          borderTop: "2px solid rgba(255,255,255,0.3)",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        width="100%"
      >
        {/* Avatar with smiley button */}
        <Box position="relative" display="inline-block">
          <PlayerAvatarWithTimer
            gameData={gameData}
            player={clientPlayer}
            timeLeft={timeLeft}
          />
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              top: -6,
              right: -6,
              backgroundColor: "rgba(0,0,0,0.4)",
              color: "white",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
            }}
            onClick={handleEmojiInputOpen}
          >
            <EmojiEmotionsOutlined fontSize="small" />
          </IconButton>
        </Box>
        <Typography color="white" variant="h6">
          {clientPlayer.firstName}
        </Typography>

        {/* Cards */}
        {gameData.turnIndex >= 0 && (
          <>
            <Box
              display="flex"
              justifyContent="center"
              position="relative"
              sx={{ height: 120, width: "100%", mt: 1 }}
            >
              {clientPlayer.cards.map((card, i) => {
                const isSelected = selectedCard && selectedCard.id === card.id;
                const isTurn =
                  gameData.turnIndex === clientPlayer.gameIndex &&
                  (!hasMatchingCard || gameData.tableSuit == null || card.cardName === gameData.tableSuit);

                return (
                  <motion.div
                    key={i}
                    drag
                    dragSnapToOrigin
                    dragConstraints={{ top: -400, bottom: 0, left: -300, right: 300 }}
                    whileDrag={{ scale: 1.15 }}
                    onMouseDown={() => setSelectedCard(card)}
                    onDragStart={() => handleStartDrag(i)}
                    onDragEnd={(event, info) => handleDrop(card, info, isTurn)}
                    onDrag={(event, info) => handleDragCard(event, info)}
                    style={{
                      position: "absolute",
                      left: `calc(50% - ${(clientPlayer.cards.length * 30) / 2}px + ${i * 30}px)`,
                      zIndex: draggingIndex === i ? zValue.current : i,
                    }}
                  >
                    <Card
                      onClick={() => setSelectedCard(card)}
                      sx={{
                        width: isSelected ? 80 : 60,
                        height: isSelected ? 110 : 90,
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        transform: isSelected ? "translateY(-15px)" : "none",
                        boxShadow: isSelected ? 6 : 2,
                        overflow: "hidden",
                      }}
                    >
                      {renderCardDesign(card, "classic", isTurn)}
                    </Card>
                  </motion.div>
                );
              })}
            </Box>



            {/* Action Buttons */}
            <Box display="flex" justifyContent="center" gap={2}>
              {!clientPlayer.sorted && gameData.turnIndex >= 0 && (
                <GloriousButton
                  onClick={() => handleSortCard()}
                  text='SORT'
                />
              )}
              <GloriousButton
                onClick={selectedCard !== null
                  ? () => handlePlayCard()
                  : null
                }
                text='PLACE'
              />
            </Box>
          </>
        )}
      </Box>
      <CustomSnackbar
        open={snackbar.open}
        onClose={snackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
      <EmojiPopover
        anchorPopoverEl={anchorPopoverEl}
        handlePopoverClose={handlePopoverClose}
        onEmojiSelect={handleEmojiClick} />
    </Box>
  );
}


const socketUrl = (match) => {
  const token = localStorage.getItem("accessToken");
  switch (match) {
    case "bot":
      return `${gameAi}?token=${token}&bot=true`;
    case "classic":
      return `${game}?token=${token}&classic=true`;
    case "quick":
      return `${game}?token=${token}&roomId=quick`;
    default:
      return `${game}?token=${token}${match ? "&roomId=" + match : ""}`;
  }
}

const getCardImage = (imageName) => {
  try {
    return require(`../images/cards/${imageName}`);
  } catch (error) {
    return require(`../images/card-back.png`); // Fallback
  }
};

const renderCardDesign = (card, theme, isMatched = true) => {
  switch (theme) {
    case "classic":
      return (
        <Card
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: isMatched ? 'white' : "gray",
            border: "2px solid #000",
            borderRadius: "12px",
            boxShadow: 3,
            position: "relative",
            fontFamily: "serif",
          }}
        >
          <Box sx={{
            position: "absolute",
            top: 5,
            left: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            fontSize: 16,
            color: card?.color || "green",
            lineHeight: 1.1,
          }}
          >
            <span> {card.cardNumber}</span>
            <span>{card.cardIcon}</span>
          </Box>
          <Box sx={{ position: "absolute", bottom: 5, right: 5, fontSize: 16, color: card.color }}>
            {card.cardIcon} {card.cardNumber}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 36, color: card.color }}>
            {card.cardIcon}
          </Box>
        </Card>
      );

    case "uno":
      return (
        <Card
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${card.color === "red" ? "#e63946" : "#1d3557"} 50%, black 50%)`,
            color: "white",
            fontWeight: "bold",
            boxShadow: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {card.number}
        </Card>
      );

    case "glass":
      return (
        <Card
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: "bold",
            color: card.color,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {card.symbol} {card.number}
        </Card>
      );

    case "chip":
      return (
        <Card
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: card.color === "red" ? "#d62828" : "#003049",
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {card.symbol} {card.number}
        </Card>
      );

    default:
      return null;
  }
};
