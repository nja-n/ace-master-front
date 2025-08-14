// src/components/PhoneLogin.js
import React, { useState } from "react";
import { auth } from "../firebase-config";
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from "firebase/auth";

const PhoneLogin = ({ onVerified }) => {
    const [phone, setPhone] = useState("+919061365293");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                auth,
                "recaptcha-container",
                {
                    size: "invisible", // or "normal" if you want to show it
                    callback: (response) => {
                        console.log("reCAPTCHA solved");
                    },
                    'expired-callback': () => {
                        console.log("reCAPTCHA expired. Try again.");
                    },
                },
            );
        }
    };


    const handleSendOtp = async () => {
        if (!phone) return;
        let addedCode = "+91" + phone;
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        setIsLoading(true);

        try {
            const confirmation = await signInWithPhoneNumber(auth, addedCode, appVerifier);
            setConfirmationResult(confirmation);
            console.log(confirmation)
            setMessage("OTP sent!");
        } catch (err) {
            setMessage("Failed to send OTP: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || !confirmationResult) return;
        setIsLoading(true);

        try {
            await confirmationResult.confirm(otp);
            setMessage("Phone number verified!");

            if (onVerified) {
                onVerified();
            }
        } catch (err) {
            setMessage("Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
                {isLoading && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm pointer-events-auto">
                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
                    Login with OTP {isLoading ? 'OTP' : 'Yes'}
                </h2>

                {/* Phone input group */}
                <div className="flex mb-4">
                    <select
                        className="border border-purple-300 rounded-l-lg px-3 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value="+91"
                        disabled
                    >
                        <option value="+91">+91 🇮🇳</option>
                        <option value="+1">+1 🇺🇸</option>
                        <option value="+971">+971 🇦🇪</option>
                        {/* Add more countries as needed */}
                    </select>
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border-t border-b border-r border-purple-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <button
                    onClick={handleSendOtp}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg mb-6 hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                    Send OTP
                </button>

                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                    onClick={handleVerifyOtp}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
                >
                    Verify OTP
                </button>

                <div id="recaptcha-container" className="mt-4" />
                {message && (
                    <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
                )}
            </div>
        </div>
    );

};

export default PhoneLogin;
