import { useEffect, useRef } from "react";
import audiofast from "../../assets/sounds/bgm_fast.mp3";
import audioSlow from "../../assets/sounds/bgm_slow.mp3";
import { useSound } from "./SoundProvider";

export default function MusicPlayer() {
  const audio_bgm_1 = useRef(new Audio(audiofast));
  const audio_bgm_2 = useRef(new Audio(audioSlow));
  const chosenRef = useRef(null); // keep track of which bgm is playing
  const started = useRef(false);

  const { musicOn } = useSound();

  useEffect(() => {
    if (!musicOn) {
      // 🔇 Turn off immediately
      if (chosenRef.current) {
        chosenRef.current.pause();
        chosenRef.current.currentTime = 0;
      }
      started.current = false; // reset so next toggle can restart
      return;
    }

    if (started.current) {
      // already started, just ensure it's playing
      chosenRef.current?.play().catch((err) => {
        console.warn("Resume play failed:", err);
      });
      return;
    }

    const handleStart = () => {
      started.current = true;
      chosenRef.current =
        Math.random() < 0.5 ? audio_bgm_1.current : audio_bgm_2.current;
      chosenRef.current.loop = true;
      chosenRef.current
        .play()
        .catch((err) => console.warn("Failed to play sound:", err));
      document.removeEventListener("click", handleStart);
    };

    // wait for first interaction
    document.addEventListener("click", handleStart);
    return () => document.removeEventListener("click", handleStart);
  }, [musicOn]);

  return null; // no UI, just audio control
}
