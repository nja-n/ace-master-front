import React, { useRef, useState } from "react";
import { Box, TextField, InputAdornment, Button, CircularProgress, Switch, FormControlLabel, styled } from "@mui/material";
import { Check, Close, LoginRounded, LoginSharp, SaveAs } from "@mui/icons-material";
import { sendOtp, signUp, verifyOtp } from "./methods";
import { apiClient } from "./ApIClient";
import { useNavigate } from "react-router-dom";
import { tr } from "framer-motion/client";
import MaterialUISwitch from "./ui/MaterialUISwitch";

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

    const handleNumberChange = (e) => {
        const input = e.target.value.replace(/\D/g, "");
        if (input.length <= 10) {
            setNumber(input);
        }
    };

    const handleSendOtp = async () => {
        if (number.length !== 10) return;

        setIsLoading(true);
        setOtp(Array(4).fill(""));

        try {
            const response = await fetch(sendOtp, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ mobileNumber: number })
            });

            const result = await response.json();

            if (result.status === "Y") {
                setUid(result.uuid);
                setShowOtpScreen(true);
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
                body: JSON.stringify({ password: otpValue, uuid: uid, mobileNumber: number, rememberMe: rememberMe })
            });

            const result = await response.json();

            if (result.status === "Y") {
                console.log("Login successful:", result);

                localStorage.setItem("accessToken", result.authResponse.token);
                if (result.userStatus === "N") {
                    setNewUser(true);
                } else {
                    onAuthenticated();
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
        const formData = new FormData(userForm.current);
        const deviceInfo = await getDeviceInfo();
        
        // const payload = {
        //     ...Object.fromEntries(formData.entries()),
        //     ...deviceInfo
        // };
        const payload = {
  firstName: "Vishnu",
  lastName: "MG",
  email: "v4vishnumg25@gmail.com",
  userAgent: deviceInfo.userAgent,
  platform: deviceInfo.platform,
  screenWidth: deviceInfo.screenWidth,
  screenHeight: deviceInfo.screenHeight
};
        console.log("Payload for sign up:", payload);
        
        const response = await apiClient(signUp, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: payload,
            credentials: 'include'
        });

        //const result = await response.json();
        if (response.status === "Y") {
            alert("User registered successfully!");
            onAuthenticated();
            navigate(`/game/ai`);
        }
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {!showOtpScreen ? (
                <>
                    <TextField
                        id="mobile-input"
                        size="small"
                        placeholder="Mobile Number"
                        variant="outlined"
                        value={number}
                        onChange={handleNumberChange}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                        }}
                        sx={{
                            backgroundColor: "white",
                            borderRadius: "5px",
                            //width: "250px",
                        }}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        disabled={isLoading || number.length !== 10}
                        startIcon={
                            isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <LoginRounded />
                            )
                        }

                        onClick={handleSendOtp}
                        sx={{
                            backgroundColor: '#1877F2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#145dbf'
                            },
                            fontWeight: 'bold'
                        }}
                        fullWidth
                    >
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </Button>
                </>
            ) : (
                newUser ? (
                    <form ref={userForm}>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                variant="filled"
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: "5px",
                                    //width: "250px",
                                }}
                                fullWidth
                            />
                            <TextField
                                label="Last Name"
                                name="lastName"
                                variant="filled"
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: "5px",
                                    //width: "250px",
                                }}
                                fullWidth
                            />
                            <TextField
                                label="Email (optional)"
                                name="email"
                                variant="filled"
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: "5px",
                                    //width: "250px",
                                }}
                                fullWidth
                            />
                            <Button
                                variant="contained"
                                startIcon={<SaveAs />}
                                onClick={saveNewUser}
                                sx={{
                                    backgroundColor: '#1877F2',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: '#145dbf'
                                    },
                                    fontWeight: 'bold'
                                }}
                                fullWidth
                            >Sign Up</Button>
                        </Box>
                    </form>
                ) : (
                    <>
                        <Box display="flex" gap={1}>
                            {otp.map((digit, idx) => (
                                <TextField
                                    key={idx}
                                    id={`otp-${idx}`}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                                    sx={{
                                        width: 50,
                                        backgroundColor: "white",
                                        borderRadius: "5px",
                                        color: "red"
                                    }}
                                />
                            ))}
                        </Box>
                        <Box sx={{ color: "yellow", fontSize: "0.8rem" }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <FormControlLabel
                                    control={
                                        <MaterialUISwitch
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
                                        />
                                    }
                                    label="Remember Me"
                                />
                                {rememberMe ? (
                                    <Check color="success" fontSize="small" />
                                ) : (
                                    <Close color="error" fontSize="small" />
                                )}
                            </Box>
                            {/* <TextField
                                key={idx}
                                id={`otp-${idx}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
                                sx={{
                                    width: 50,
                                    backgroundColor: "white",
                                    borderRadius: "5px",
                                    color: "red"
                                }}
                            /> */}
                        </Box>
                        <Button
                            variant="contained"
                            disabled={number.length !== 10}
                            startIcon={<LoginSharp />}
                            onClick={handleVerifyOtp}
                            sx={{
                                backgroundColor: '#1877F2',
                                color: 'white',
                                '&:hover': {
                                    backgroundColor: '#145dbf'
                                },
                                fontWeight: 'bold'
                            }}
                            fullWidth
                        >
                            Verify OTP
                        </Button>
                    </>
                )
            )}
        </Box>
    );
};

export default Login;

const getDeviceInfo = async () => {
    // Get OS and Platform
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    return { userAgent, platform, screenWidth, screenHeight };
};

