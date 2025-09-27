import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const amount = parseInt(params.get("amount"), 10) || 0;

    if (amount > 0) {
      alert(`{ type: "ADD_COINS", payload: amount }`);
    }

    // Redirect back to home/dashboard after update
    setTimeout(() => navigate("/"), 1500);
  }, [params, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Payment Successful 🎉</h2>
      <p>Your coins have been added!</p>
    </div>
  );
};

export default PaymentSuccess;
