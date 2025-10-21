import { AppBar, Toolbar, IconButton, Box, Typography, Button } from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
// import { useWindowSize } from "react-use";
import AceMasterLogo from "../../components/ui/GameLogoHeader";
import GloriousButton from "../../components/ui/GloriousButton";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { useEffect, useState } from "react";
import { useSound } from "../../components/utils/SoundProvider";
import { emit } from "../../components/utils/eventBus";
import { apiClient } from "../../components/utils/ApIClient";
import { readLastSession } from "../../components/methods";

export default function GameOverScreen({ gameData, handleResetGame }) {
  //   const { width, height } = useWindowSize();
  const navigate = useNavigate();
  const { playSound } = useSound();
  const [gameSession, setGameSession] = useState(null);

  useEffect(() => {
    playSound("celebration");
    emit("user:refresh");

    const gameSessionRead = async () => {
      console.log("Ending game session for ID:", gameData.lastId);
      if(!gameData.lastId) return;
      try {
        const response = await apiClient(`${readLastSession}/${gameData.lastId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setGameSession(response);
        console.log("Game session ended:", response);
        alert("Game session ended successfully.");
      } catch (error) {
        console.error("Error ending game session:", error);
      }
    };
    
    gameSessionRead();
  }, []);

  if (!gameData.looserPlayer) return null;

  const sortedPlayers = [...gameData.players].sort(
    (a, b) => a.winningRank - b.winningRank
  );

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 🎆 Confetti only if there is a winner */}
      <AnimatePresence>
        {sortedPlayers[0] && sortedPlayers[0].winningRank === 0 && (
          <Confetti numberOfPieces={200} recycle={false} />
          //   width={width} height={height}
        )}
      </AnimatePresence>

      <Header />

      {/* 🏆 Game Over Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          py: 6,
          textAlign: "center",
        }}
      >
        {/* Title */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          <Typography
            variant="h3"
            color="white"
            fontWeight="bold"
            gutterBottom
            sx={{ textShadow: "0 0 12px rgba(255,255,255,0.8)" }}
          >
            GAME OVER
          </Typography>
        </motion.div>

        {/* Players Ranking */}
        <Box mt={3}>
          {sortedPlayers.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3, duration: 0.6 }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: player.winningRank === 0 ? "#ffd700" : player.winningRank === 1 ? "#c8e6c9" : "#ff5252",
                  fontWeight: player.winningRank === 0 ? "bold" : "medium",
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                  textShadow: player.winningRank === 0 ? "0 0 10px gold" : "none",
                }}
              >
                {player.winningRank === 1 ? "👑" : player.winningRank === 2 ? "" : "😭"}
                {getOrdinalSuffix(player.winningRank)} :{" "}
                {player.firstName ? player.firstName : "You"}
                {player.winningAmount
                  ? " - " + player.winningAmount + " Points"
                  : ""}
              </Typography>
            </motion.div>
          ))}
        </Box>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sortedPlayers.length * 0.3 }}
        >
          <Box mt={5} display="flex" gap={3} flexWrap="wrap" justifyContent="center">
            <GloriousButton onClick={() => handleResetGame()} text="Start Again" />
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
        </motion.div>
      </Box>
    </Box>
  );
}

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