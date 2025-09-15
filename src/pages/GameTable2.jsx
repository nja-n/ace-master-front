import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { ArrowBack, Refresh, QuestionMark, Share } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import logo from '../images/back_thumb.jpg';

export default function GameTableDesign() {
  const [selectedCard, setSelectedCard] = useState(null);

  const [tableCards, setTableCards] = useState(["5♥", "Q♣"]);


  const [flyingCard, setFlyingCard] = useState(null);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const dropRef = useRef(null);


  // const theme = useTheme();

  // Dummy data
  const dummyPlayers = [
    { id: 1, name: "Alice", cards: [1, 2, 3], rank: 1 },
    { id: 2, name: "Bob", cards: [1, 2, 3], rank: 2 },
    { id: 3, name: "Charlie", cards: [1, 2, 3], rank: null },
    { id: 3, name: "Charlie", cards: [1, 2, 3], rank: null },
    { id: 3, name: "Charlie", cards: [1, 2, 3], rank: null },
    { id: 3, name: "Charlie", cards: [1, 2, 3], rank: null },
  ];
  const clientPlayer = {
    id: 0,
    name: "You",
    cards: [
      { number: "A", symbol: "♠", color: "black" },
      { number: "10", symbol: "♥", color: "red" },
      { number: "7", symbol: "♣", color: "black" },
      { number: "K", symbol: "♦", color: "red" }
    ]
    ,
    sorted: false,
  };
  useEffect(() => {
    setTableCards(["5♥", "Q♣", "5♥", "Q♣", "5♥", "Q♣"]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth", // optional smooth scroll
      });
    }
  }, []); // scroll on mount


  const closedCards = 20;
  const countDown = 5;

  const handlePlayerClick = (player, e) => {
    if (!player.cards.length || !containerRef.current) return;

    const card = player.cards[0]; // pick 1 card for demo
    const containerBox = containerRef.current.getBoundingClientRect();
    const playerBox = e.currentTarget.getBoundingClientRect();

    // get center of clicked player box relative to container
    const top = ((playerBox.top + playerBox.height / 2 - containerBox.top) / containerBox.height) * 100;
    const left = ((playerBox.left + playerBox.width / 2 - containerBox.left) / containerBox.width) * 100;

    setFlyingCard({ card, top, left });

    setTimeout(() => {
      setTableCards((prev) => [...prev, card]); // add to table
      setFlyingCard(null);
    }, 1000);
  };

  const handleDrop = (card, info) => {
    if (!dropRef.current) return;

    const dropBox = dropRef.current.getBoundingClientRect();
    const { x, y } = info.point; // final drop position

    if (
      x >= dropBox.left &&
      x <= dropBox.right &&
      y >= dropBox.top &&
      y <= dropBox.bottom
    ) {
      console.log("\nDropped:", card);
      //setDroppedCards((prev) => [...prev, card]);

      // 🚀 TODO: trigger your game action here
    }
  };



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
        //backgroundColor: "#2e7d32",
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "auto",
      }}
    >

      {/* Opponents Section */}
      <Box

        ref={containerRef}
        sx={{
          position: "relative",
          width: "100%",  // full width of parent
          maxWidth: { xs: "100%", sm: 500, md: 600 }, // cap on bigger screens
          aspectRatio: {
            xs: "3/4",   // mobile (taller oval)
            sm: "4/3",   // tablet (balanced oval)
            md: "3/2",   // desktop (wider oval)
          },

          borderRadius: "50%",
          background: "radial-gradient(circle, #044a2d, #022218)",
          height: "100%",          // show only 3/4 of the height
          borderRadius: "50% / 75%", // squash vertically so top looks right

          margin: "0 auto", // center horizontally
          overflow: "hidden",     //
          //clipPath: "inset(0 0 25% 0)",
        }}

      >
        {/* Players on top half circle */}
        {dummyPlayers.map((player, index) => {
          const total = dummyPlayers.length;
          const angle = (index / (total - 1)) * Math.PI; // 0 → π (top half)
          const radius = { xs: 30, sm: 40, md: 40 }; // smaller on mobile


          return (
            <Box
              key={player.id}
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
              }}
            >
              <Avatar>

              </Avatar>
              <Typography color="white" fontWeight="bold" fontSize={{ xs: 10, sm: 12, md: 14 }}>
                {player.name}
              </Typography>
              <Box display="flex" gap={0.5} justifyContent="center" onClick={(e) => handlePlayerClick(player, e)}>
                {player.cards.map((_, i) => (
                  <Card
                    key={i}
                    sx={{
                      width: { xs: 20, sm: 30, md: 40 },
                      height: { xs: 30, sm: 45, md: 60 },
                      backgroundColor: "gray",
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
          {/* Closed Cards */}
          <Card sx={{ width: { xs: 40, sm: 50, md: 60 }, height: { xs: 60, sm: 75, md: 90 }, backgroundColor: "white" }}>
            <CardContent
              sx={{ fontSize: { xs: 14, sm: 18, md: 24 }, textAlign: "center", fontWeight: "bold", p: 1 }}
            >
              {closedCards}
              <Box sx={{ fontSize: { xs: 8, sm: 10, md: 12 } }}>Cards</Box>
            </CardContent>
          </Card>

          {/* Table Cards */}
          <Box display="flex" gap={{ xs: 1, sm: 1.5, md: 2 }}>
            {tableCards.map((c, i) => (
              <Card
                key={i}
                sx={{ width: { xs: 40, sm: 50, md: 60 }, height: { xs: 60, sm: 75, md: 90 }, backgroundColor: "white" }}
              >
                <CardContent
                  sx={{ fontSize: { xs: 12, sm: 18, md: 22 }, textAlign: "center", fontWeight: "bold", p: 1 }}
                >
                  {c}
                </CardContent>
              </Card>
            ))}
          </Box>
          <Box
            ref={dropRef}
            sx={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              height: 120,
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
            Drop Here
          </Box>
        </Box>
        {/* Flying Card Animation */}
        <AnimatePresence>
          {flyingCard && (
            <motion.div
              // initial={{ top: "10%", left: "30%" }} // starting point
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
              {flyingCard.card}
            </motion.div>
          )}
        </AnimatePresence>


      </Box>

      {/* Bottom, Section*/}
      <Box
        position="relative"
        textAlign="center"
        sx={{
          p: 2,
          borderTop: "2px solid rgba(255,255,255,0.3)",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
        width="100%"
      >
        <Typography color="white" variant="h6">
          {clientPlayer.name}
        </Typography>

        {/* Cards */}
        <Box
          display="flex"
          justifyContent="center"
          position="relative"
          sx={{ height: 120, width: "100%", mt: 1 }}
        >
          {clientPlayer.cards.map((card, i) => (
            <motion.div
              key={i}
              drag
              // dragConstraints={{ left: 0, right: 300, top: 0, bottom: 100 }} // keep inside
              dragConstraints={{ top: -300, bottom: 0, left: -40, right: 40 }}


              // style={{
              //   position: "absolute",
              //   //left: i * 30,
              //   cursor: "grab",
              // }}

              whileDrag={{ scale: 1.15 }} // smooth zoom on drag
              onMouseDown={() => setSelectedCard(i)}
              onDragEnd={(event, info) => handleDrop(card, info)}
            >
              <Card
                key={i}
                onClick={() => setSelectedCard(i)}
                sx={{
                  position: "absolute",
                  // left: `${i * 30}px`, // overlap spacing
                  left: `calc(50% - ${(clientPlayer.cards.length * 30) / 2}px + ${i * 30}px)`,
                  width: selectedCard === i ? 80 : 60,
                  height: selectedCard === i ? 110 : 90,
                  // backgroundColor: "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease-in-out",
                  transform: selectedCard === i ? "translateY(-15px)" : "none",
                  boxShadow: selectedCard === i ? 6 : 2,
                  // borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* <CardContent
                  sx={{
                    fontSize: 22,
                    textAlign: "center",
                    color: card.color === "red" ? "red" : "black", // dynamic color
                    p: 1,
                  }}
                >
                  {card.symbol} {card.number}
                </CardContent> */}
                {/* <CardMedia
                  component="img"
                  image={getCardImage(card.fileName)}
                  alt="Logo"
                  sx={{ width: "97%", height: "99%" }}
                /> */}
                {renderCardDesign(card, "classic")}
              </Card>
            </motion.div>
          ))}
        </Box>


        {/* Action Buttons */}
        <Box mt={2} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary">
            Sort
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={selectedCard === null}
          >
            Place
          </Button>
        </Box>

        {/* Countdown */}
        <Box mt={2} width="60%" mx="auto">
          <Typography color="white">Starts in... {countDown} Sec</Typography>
          <LinearProgress color="inherit" />
        </Box>
      </Box>
    </Box>
  );
}


const getCardImage = (imageName) => {
  try {
    return require(`../images/cards/${imageName}`);
  } catch (error) {

    return require(`../images/card-back.png`); // Fallback
    // return require(`../images/cards/default_card.jpg`); // Fallback
  }
};

const renderCardDesign = (card, theme) => {
  switch (theme) {
    case "classic":
      return (
        <Card
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
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
            color: card.color,
            lineHeight: 1.1,
          }}
          >

            <span> {card.number}</span>
            <span>{card.symbol}</span>
          </Box>
          <Box sx={{ position: "absolute", bottom: 5, right: 5, fontSize: 16, color: card.color }}>
            {card.symbol} {card.number}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 36, color: card.color }}>
            {card.symbol}
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
