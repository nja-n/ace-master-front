import React, { useState } from "react";
import { setUpRecaptcha } from "../firebase-config";
import { auth } from "../firebase-config";
import { signInWithCredential, PhoneAuthProvider } from "firebase/auth";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const sendOtp = async () => {
    alert("Sending OTP..." + phone);
    try {
      const result = await setUpRecaptcha(phone);
      setConfirmationResult(result);
      alert("OTP sent!");
    } catch (err) {
      console.error(err);
    }
  };

  const verifyOtp = async () => {
    try {
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, otp);
      await signInWithCredential(auth, credential);
      alert("Phone login successful!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91XXXXXXXXXX" />
      <div id="recaptcha-container"></div>
      <button onClick={sendOtp}>Send OTP</button>

      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
      <button onClick={verifyOtp}>Verify OTP</button>
    </div>
  );
}
