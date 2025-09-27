// GlassShatterSVG.jsx
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

/**
 * Props:
 *  - size: number (pixels) of the square area, default 64
 *  - trigger: boolean - start animation when true
 *  - soundSrc: string - optional path to glass-break sound
 *  - keepLastFrame: boolean - if true, don't call onComplete automatically
 *  - onComplete: function - called when animation finishes (unless keepLastFrame)
 */
const GlassShatterSVG = ({
  size = 64,
  trigger = false,
  soundSrc = "/sounds/glass-break.mp3",
  keepLastFrame = false,
  onComplete = () => {},
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (!trigger) return;

    // play sound (best-effort)
    if (soundSrc) {
      try {
        const a = new Audio(soundSrc);
        a.play().catch(() => {});
      } catch (e) {
        // ignore
      }
    }

    // run animation sequence
    const timeline = async () => {
      // initial quick flash (optional)
      await controls.start(i => ({
        opacity: [0, 1],
        transition: { duration: 0.06 },
      }));

      // shards 'explode' outward with stagger
// inside timeline()
await controls.start(i => {
  const target = shardTargets[i] || { x: 0, y: 0, rot: 0 };
  return {
    opacity: [1, 1],
    translateX: target.x,
    translateY: target.y,
    rotate: target.rot,
    scale: [1, 1.05],
    transition: {
      delay: i * 0.04,
      duration: 0.7,
      ease: [0.25, 0.8, 0.25, 1],
    },
  };
});

      // fade out a bit after
      await controls.start(i => ({
        opacity: [1, 0],
        transition: { duration: 0.35, delay: 0.05 },
      }));

      if (!keepLastFrame) onComplete();
    };

    timeline();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  // Precomputed targets for shards (px)
  const r = size / 2;
  // these are relative translations in pixels - tuned for 64px area
  const shardTargets = [
    { x: -8, y: -22, rot: -22 },
    { x: 10, y: -18, rot: 18 },
    { x: 20, y: -2, rot: 28 },
    { x: 18, y: 16, rot: 12 },
    { x: -6, y: 18, rot: -8 },
    { x: -20, y: 6, rot: -30 },
  ];

  // Basic shard shapes (polygons/paths) positioned inside a circle
  // You can tweak paths to change look.
  const shards = [
    "M32 4 L40 18 L32 28 L26 20 Z", // top small
    "M32 4 L44 18 L52 26 L40 18 Z", // top-right
    "M32 28 L44 24 L52 34 L40 34 Z", // right
    "M20 30 L28 24 L32 34 L20 38 Z", // bottom-left
    "M8 24 L20 18 L28 28 L12 34 Z", // left
    "M24 12 L32 20 L20 24 L14 16 Z", // inner-left
  ];

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: size,
        height: size,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* SVG sized to size x size */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Circle mask so cracks overlay avatar circle */}
        <defs>
          <clipPath id="avatarCircle">
            <circle cx="32" cy="32" r="30" />
          </clipPath>
        </defs>

        {/* subtle glass glare behind shards */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="rgba(255,255,255,0.02)"
          stroke="rgba(255,255,255,0.03)"
        />

        {/* center small crack (drawn as lines) */}
        <g clipPath="url(#avatarCircle)" opacity="0.9">
          <motion.path
            d="M32 24 L32 40"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={controls}
            custom={0}
            style={{ mixBlendMode: "overlay" }}
          />
        </g>

        {/* shards group */}
        <g clipPath="url(#avatarCircle)">
          {shards.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="rgba(255,255,255,0.85)"
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="0.6"
              initial={{ opacity: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1 }}
              animate={controls}
              custom={i}
              style={{
                transformOrigin: "32px 32px",
                mixBlendMode: "overlay",
                filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.35))",
              }}
            />
          ))}
        </g>

        {/* faint radial cracks (decorative) */}
        <g clipPath="url(#avatarCircle)" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" opacity="0.9">
          <motion.path d="M32 32 L44 18" initial={{ opacity: 0 }} animate={controls} />
          <motion.path d="M32 32 L20 14" initial={{ opacity: 0 }} animate={controls} />
          <motion.path d="M32 32 L50 30" initial={{ opacity: 0 }} animate={controls} />
          <motion.path d="M32 32 L16 36" initial={{ opacity: 0 }} animate={controls} />
        </g>
      </svg>
    </div>
  );
};

export default GlassShatterSVG;
