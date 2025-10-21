import React, { useEffect, useRef, useState } from "react";
import { Box, TextField, InputAdornment, Button, CircularProgress, Switch, FormControlLabel, styled, Typography, IconButton } from "@mui/material";
import { ArrowBack, Check, Close, Google, HowToRegSharp, LoginRounded, LoginSharp, SaveAs } from "@mui/icons-material";
import { duplicateValidation, guestAuth, sendOtp, signUp, verifyOtp } from "./methods";
import { apiClient } from "./utils/ApIClient";
import { useNavigate } from "react-router-dom";
import { tr } from "framer-motion/client";
import MaterialUISwitch from "./ui/MaterialUISwitch";
import GoogleButton from "./utils/GoogleAuth";
import { getDeviceInfo } from "./Utiliy";
import { emit } from "./utils/eventBus";

const Login = ({ onAuthenticated }) => {
    const userForm = useRef();
    const navigate = useNavigate();

    const [number, setNumber] = useState("");
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [uid, setUid] = useState("");
    const [newUser, setNewUser] = useState(false);

    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [referralCode, setReferralCode] = useState(null);
    const [signUpError, setSignUpError] = useState("");
    const [resendTimer, setResendTimer] = useState(0);
    const [annonymous, setAnonymous] = useState(true);


    useEffect(() => {
        const code = localStorage.getItem("referralCode");
        if (code) {
            setReferralCode(code);
        }
    }, []);
    const handleNumberChange = (e) => {
        const input = e.target.value.replace(/\D/g, "");
        if (input.length <= 10) {
            setNumber(input);
        }
    };

    const handleSendOtp = async () => {
        const numberValid = number.length === 10 && /^\d+$/.test(number); // only digits
        const emailValid = email.includes("@"); // basic email check
        if (!(numberValid || emailValid)) return;

        setIsLoading(true);
        setOtp(Array(4).fill(""));

        try {
            const response = await fetch(sendOtp, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mobileNumber: number, email: email, ref: referralCode })
            });

            const result = await response.json();

            console.log("OTP send response:", result);
            if (result.status === "Y") {
                setUid(result.uuid);
                setShowOtpScreen(true);
            } else {
                alert("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            alert('Failed to send OTP. Please try again later.');
            console.error("OTP send failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.every((digit) => digit !== "")) {
            const otpValue = otp.join("");
            setIsLoading(true);
            const response = await fetch(verifyOtp, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: otpValue, uuid: uid, mobileNumber: number, rememberMe: rememberMe, email: email }),
            });

            const result = await response.json();

            if (result.status === "Y") {
                if (result.userStatus === "N") {
                    setEmail(result.user.email || "");
                    setNewUser(true);
                    setAnonymous(false);
                } else {
                    localStorage.setItem("accessToken", result.accessToken);
                    localStorage.setItem("refreshToken", result.refreshToken);
                    onAuthenticated();
                    emit("user:refresh");
                }
                alert("OTP Verified!");

            } else {
                alert("Invalid OTP. Please try again.");
            }
            setIsLoading(false);
        } else {
            alert("Please enter all OTP digits");
        }
    };

    const saveNewUser = async () => {
        setIsLoading(true);
        const formData = new FormData(userForm.current);
        const deviceInfo = await getDeviceInfo();

        const payload = {
            ...Object.fromEntries(formData.entries()),
            ...deviceInfo,
            annonymous: annonymous,
            referralBy: referralCode || "",
        };
        if (!await validateSignUp(payload)) {
            setIsLoading(false);
            return
        }

        const response = await fetch(signUp, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        const result = await response.json();
        if (result.status === "Y") {
            localStorage.setItem("accessToken", result.accessToken);
            localStorage.setItem("refreshToken", result.refreshToken)
            alert("User registered successfully!");
            onAuthenticated();
            emit("user:refresh");
        }
        setIsLoading(false);
    }

    const handleGuestLogin = async () => {
        setIsLoading(true);
        try {
            /*const response = await fetch(guestAuth, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
            const jwtToken = await response.json();
            localStorage.setItem("accessToken", jwtToken.accessToken);
            localStorage.setItem("refreshToken", jwtToken.refreshToken);*/
            /*emit("user:refresh");
            onAuthenticated(true);*/
            setShowOtpScreen(true);
            setNewUser(true);
        } catch (error) {
            console.error("Guest login failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const validateSignUp = async (payload) => {
        const errors = [];
        console.log(payload)

        if (!payload.firstName || payload.firstName.trim().length === 0) {
            errors.push("First Name is required");
        }

        if (!payload.lastName || payload.lastName.trim().length === 0) {
            errors.push("Last Name is required");
        }

        if (payload.email && payload.email.trim().length > 0) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(payload.email)) {
                errors.push("Invalid email address");
            } else {
                // Check if email already exists
                try {
                    const response = await fetch(`${duplicateValidation}?email=${encodeURIComponent(payload.email)}`);
                    const data = await response.json();
                    if (data.exists) {
                        errors.push("Email already in use");
                    }
                } catch (error) {
                    console.error("Email check failed:", error);
                    errors.push("Failed to validate email");
                }
            }
        }

        if (errors.length > 0) {
            setSignUpError(errors.join(" • ")); // store message in state
            return false;
        }

        setSignUpError(""); // clear if valid
        return true;
    };

    const handleResendOtp = () => {
        if (resendTimer === 0) {
            handleSendOtp();
            setResendTimer(30); // 30 seconds cooldown
            const timerInterval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerInterval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    }

    const handleBack = () => {
        if (newUser) {
            setNewUser(false);
        } else {
            setShowOtpScreen(false);
            setOtp(["", "", "", ""]);
        }
    };


    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{
                width: "100%",
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(145deg, #1a1a1a, #000000)",
                boxShadow: "0 4px 25px rgba(0,0,0,0.7)",
            }}
        >
            {!showOtpScreen ? (
                <>
                    {referralCode && (
                        <Box sx={{ width: "100%" }}>
                            <TextField
                                label="Referred By"
                                value={referralCode}
                                fullWidth
                                InputLabelProps={{ style: { color: "#FFD700" } }}
                                InputProps={{
                                    style: {
                                        backgroundColor: "#111",
                                        borderRadius: "8px",
                                        color: "white",
                                    },
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "#FFD700" },
                                    },
                                    mb: 2,
                                }}
                            />
                        </Box>
                    )}

                    {/* 📱 Mobile Field */}
                    {/* <TextField
        id="mobile-input"
        size="small"
        placeholder="Mobile Number"
        variant="outlined"
        value={number}
        onChange={handleNumberChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ color: "#FFD700", fontWeight: "bold" }}>
              +91
            </InputAdornment>
          ),
          style: {
            backgroundColor: "#111",
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
        }}
        fullWidth
      /> */}

                    {/* 📧 Email Field */}
                    <TextField
                        size="small"
                        placeholder="Email Address"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            style: {
                                backgroundColor: "#111",
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
                        }}
                        fullWidth
                    />

                    {/* 🔘 Send OTP */}
                    <Button
                        variant="contained"
                        disabled={isLoading || (number.length !== 10 && !email.includes("@"))}
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
                        fullWidth
                    >
                        {isLoading ? "Sending..." : "Send OTP"}
                    </Button>

                    {/* 🔗 Social/Guest */}
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2, width: "100%" }}>
                        <GoogleButton onAuthenticated={onAuthenticated} referralCode={referralCode} />

                        <Button
                            variant="outlined"
                            onClick={handleGuestLogin}
                            sx={{
                                borderColor: "#FFD700",
                                color: "#FFD700",
                                fontWeight: "bold",
                                borderRadius: "10px",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                                    boxShadow: "0 0 10px #FFD700",
                                },
                            }}
                            fullWidth
                        >
                            Continue as Guest <HowToRegSharp />
                        </Button>
                    </Box>
                </>
            ) : newUser ? (
                /* 🆕 Sign Up Form */
                <Box
                    component="form"
                    ref={userForm}
                    sx={{
                        width: "100%",
                        p: 3,
                        borderRadius: 3,
                        background: "linear-gradient(145deg, #1a1a1a, #000000)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
                    }}
                >
                    <Box display="flex" flexDirection="column" gap={2}>
                        {[
                            { label: "First Name", name: "firstName" },
                            { label: "Last Name", name: "lastName" },
                            { label: "Email (optional)", name: "email" },
                        ].map((field, i) => (
                            <TextField
                                key={i}
                                label={field.label}
                                name={field.name}
                                value={field.name === 'email' && email !== "" ? email : null}
                                variant="outlined"
                                InputLabelProps={{ style: { color: "#FFD700" } }}
                                InputProps={{
                                    style: {
                                        backgroundColor: "#111",
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
                                }}
                                fullWidth
                            />
                        ))}

                        <Button
                            variant="contained"
                            onClick={saveNewUser}
                            startIcon={
                                isLoading ? <CircularProgress size={20} sx={{ color: "black" }} /> : <LoginRounded />
                            }
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
                            fullWidth
                        >
                            {isLoading ? "Signing..." : "Sign Up"}
                        </Button>
                    </Box>
                    <Box justifyContent="center">
                        {signUpError && (
                            <Typography
                                sx={{
                                    color: "#FF4C4C",
                                    fontSize: "0.9rem",
                                    fontWeight: "bold",
                                    mt: 1,
                                    textAlign: "center",
                                }}
                            >
                                {signUpError}
                            </Typography>
                        )}

                    </Box>
                </Box>
            ) : (
                /* 🔢 OTP Screen */
                <>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <IconButton
                            onClick={handleBack} // define handleBack() to go back to previous step
                            sx={{
                                color: "#FFD700",
                                "&:hover": { color: "#FFC107", transform: "scale(1.1)" },
                                transition: "all 0.2s",
                            }}
                        >
                            <ArrowBack />
                        </IconButton>

                        <Typography
                            variant="h6"
                            sx={{
                                color: "#FFD700",
                                fontWeight: "bold",
                                textAlign: "center",
                                flexGrow: 1,
                            }}
                        >
                            Verify OTP
                        </Typography>

                        {/* Spacer to keep title centered */}
                        <Box width={40} />
                    </Box>
                    <Box display="flex" gap={1}>
                        {otp.map((digit, idx) => (
                            <TextField
                                key={idx}
                                id={`otp-${idx}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                inputProps={{
                                    maxLength: 1,
                                    style: {
                                        textAlign: "center",
                                        fontSize: "1.5rem",
                                        color: "white",
                                    },
                                }}
                                sx={{
                                    width: 55,
                                    backgroundColor: "#111",
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

                    <Box sx={{ color: "#FFD700", fontSize: "0.85rem", mt: 1 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <FormControlLabel
                                control={
                                    <MaterialUISwitch checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                }
                                label="Remember Me"
                            />
                            {rememberMe ? <Check color="success" fontSize="small" /> : <Close color="error" fontSize="small" />}
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        disabled={number.length !== 10 && !email.includes("@")}
                        startIcon={<LoginSharp />}
                        onClick={handleVerifyOtp}
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
                        fullWidth
                    >
                        Verify OTP
                    </Button>
                    <Button
                        //disabled={resendTimer > 0}
                        onClick={() => {
                            if (resendTimer > 0) {
                                alert(`Please wait ${resendTimer}s before resending OTP`);
                                return;
                            }
                            handleResendOtp();
                        }}
                        sx={{
                            color: "#FFD700",
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                            textTransform: "none",
                            "&:hover": {
                                color: "#FFC107",
                                textDecoration: "underline",
                            },
                        }}
                    >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                    </Button>
                </>
            )}
        </Box>

    );
};

export default Login;

