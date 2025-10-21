import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { ArrowBack, LoginRounded } from "@mui/icons-material";
import { sendOtp, verifyOtp } from "../../components/methods";
import { em } from "framer-motion/client";
import { emit } from "../../components/utils/eventBus";

export const EmailConnect = ({ open, onClose, userId }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!email.includes("@")) return alert("Enter a valid email");
    setIsLoading(true);
    try {
      const res = await fetch(sendOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (result.status === "Y") {
        setUid(result.uuid);
        setShowOtpScreen(true);
        setResendTimer(30);
      } else alert("Failed to send OTP");
    } catch (err) {
      console.error("Send OTP failed:", err);
      alert("Network error. Try again later.");
    }
    setIsLoading(false);
  };

  // ✅ OTP field handler
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) return alert("Enter 4-digit OTP");

    setIsLoading(true);
    try {
      const res = await fetch(verifyOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: otpValue, uuid: uid, email, userid: userId, path: "verify-otp-connect"}),
      });
      const result = await res.json();
      if (result.status === "Y") {
        alert("Email linked successfully!");
        emit("user:refresh");
        onClose();
      } else {
        alert("Invalid OTP. Try again.");
      }
    } catch (err) {
      console.error("Verify OTP failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    handleSendOtp();
  };

  // ✅ Reset on close
  useEffect(() => {
    if (!open) {
      setEmail("");
      setOtp(["", "", "", ""]);
      setShowOtpScreen(false);
      setResendTimer(0);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 350,
          bgcolor: "#111",
          color: "white",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 0 20px rgba(255,215,0,0.3)",
        }}
      >
        {!showOtpScreen ? (
          <>
            <Typography variant="h6" sx={{ mb: 2, color: "#FFD700", fontWeight: "bold" }}>
              Link Your Email
            </Typography>
            <TextField
              placeholder="Enter your email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                style: {
                  backgroundColor: "#1a1a1a",
                  borderRadius: "8px",
                  color: "white",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#FFD700" },
                  "&:hover fieldset": { borderColor: "#FFC107" },
                  "&.Mui-focused fieldset": { borderColor: "#FFD700" },
                },
                mb: 2,
              }}
              fullWidth
            />
            <Button
              fullWidth
              variant="contained"
              disabled={isLoading || !email.includes("@")}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} sx={{ color: "black" }} />
                ) : (
                  <LoginRounded />
                )
              }
              onClick={handleSendOtp}
              sx={{
                background: "linear-gradient(90deg, #FFD700, #FFC107)",
                color: "black",
                fontWeight: "bold",
                borderRadius: "10px",
                "&:hover": {
                  background: "linear-gradient(90deg, #FFC107, #FFA000)",
                  boxShadow: "0 0 15px #FFD700",
                },
              }}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <IconButton
                onClick={() => setShowOtpScreen(false)}
                sx={{ color: "#FFD700", "&:hover": { color: "#FFC107" } }}
              >
                <ArrowBack />
              </IconButton>
              <Typography sx={{ color: "#FFD700", fontWeight: "bold" }}>
                Verify OTP
              </Typography>
              <Box width={40} />
            </Box>

            <Box display="flex" justifyContent="center" gap={1} mb={2}>
              {otp.map((digit, i) => (
                <TextField
                  key={i}
                  id={`otp-${i}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center", fontSize: "1.4rem", color: "white" },
                  }}
                  sx={{
                    width: 50,
                    backgroundColor: "#1a1a1a",
                    borderRadius: "8px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "#FFD700" },
                      "&:hover fieldset": { borderColor: "#FFC107" },
                      "&.Mui-focused fieldset": {
                        borderColor: "#FFD700",
                        boxShadow: "0 0 8px #FFD700",
                      },
                    },
                  }}
                />
              ))}
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOtp}
              startIcon={<LoginRounded />}
              sx={{
                background: "linear-gradient(90deg, #FFD700, #FFC107)",
                color: "black",
                fontWeight: "bold",
                borderRadius: "10px",
                "&:hover": {
                  background: "linear-gradient(90deg, #FFC107, #FFA000)",
                  boxShadow: "0 0 15px #FFD700",
                },
                mb: 1,
              }}
            >
              Verify OTP
            </Button>

            <Button
              onClick={handleResendOtp}
              sx={{
                color: "#FFD700",
                fontWeight: "bold",
                fontSize: "0.9rem",
                textTransform: "none",
                "&:hover": { color: "#FFC107", textDecoration: "underline" },
              }}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
};
