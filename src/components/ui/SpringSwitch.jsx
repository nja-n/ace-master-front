import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

export const SpringSwitch = ({ checked, onChange }) => {
  const [isOn, setIsOn] = useState(checked);
  const x = useMotionValue(isOn ? 26 : 0);

  // Background: dark gray when OFF → golden gradient when ON
  const background = useTransform(
    x,
    [0, 26],
    [
      "linear-gradient(135deg, #374151, #1f2937)", // gray tones OFF
      "linear-gradient(135deg, #FFD700, #FFA500, #FFD700)" // gold gradient ON
    ]
  );

  useEffect(() => {
    animate(x, isOn ? 26 : 0, {
      type: "spring",
      stiffness: 500,
      damping: 30,
    });
  }, [isOn]);

  const toggle = () => {
    setIsOn(!isOn);
    onChange?.(!isOn);
  };

  return (
    <motion.div
      style={{
        width: 64,
        height: 34,
        borderRadius: 50,
        display: "flex",
        alignItems: "center",
        padding: "4px",
        cursor: "pointer",
        background,
        boxShadow: isOn
          ? "0 0 15px rgba(255,215,0,0.9), inset 0 0 10px rgba(255,215,0,0.6)"
          : "inset 0 0 6px rgba(0,0,0,0.5)",
      }}
      onClick={toggle}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: isOn
            ? "radial-gradient(circle at 30% 30%, #fff8dc, #ffd700, #b8860b)"
            : "#e5e7eb", // light gray knob when off
          x,
          boxShadow: isOn
            ? "0 0 12px rgba(255,215,0,0.8), inset 0 -2px 6px rgba(184,134,11,0.8)"
            : "0 3px 6px rgba(0,0,0,0.4)",
        }}
        whileHover={{ scale: 1.1 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.div>
  );
};
