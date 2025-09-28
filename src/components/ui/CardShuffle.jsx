import { Box, Card, CardMedia } from "@mui/material";
import { motion } from "framer-motion";

const ShuffleAnimation = ({ duration = 3, onFinish }) => {
  const cards = Array.from({ length: 5 }, (_, i) => i); // 5 cards for shuffle

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration * 1000);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <Box
      sx={{
        position: "relative",
        width: 200,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {cards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ rotate: -10 + i * 5, x: i * 8 }}
          animate={{
            rotate: [ -20, 20, -15, 15, 0 ],
            x: [ -20, 20, -10, 10, 0 ],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          style={{
            position: "absolute",
            width: 60,
            height: 90,
          }}
        >
          <Card sx={{ width: "100%", height: "100%" }}>
            <CardMedia
              component="img"
              image={getCardImage("card-back.png")}
              alt="Card"
              sx={{ width: "100%", height: "100%" }}
            />
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};
