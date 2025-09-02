import { Dialog, DialogContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../../images/1000102291.png";

const CountDown = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [expired, setExpired] = useState(false);

  // Target date: September 2, 2025 10:00 AM (local time)
  const targetDate = new Date("2025-09-01T10:00:00");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setExpired(true);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Countdown Dialog */}
      <Dialog open={!expired} fullScreen>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #053f05, #006400, #0a8a0a)",
            backgroundSize: "600% 600%",
            animation: "gradientShift 10s ease infinite",
          }}
        >
          {/* Logo animation */}
          <motion.img
            src={logo}
            alt="Logo"
            style={{ width: "200px", marginBottom: "20px" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Title animation */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Typography variant="h4" color="white" gutterBottom>
              Launching Soon 🚀
            </Typography>
          </motion.div>

          {/* Countdown Numbers with bounce */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Typography variant="h5" color="white">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
              {timeLeft.seconds}s
            </Typography>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* CSS animation for background gradient */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </>
  );
};

export default CountDown;
