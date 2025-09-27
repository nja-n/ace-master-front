import { createContext, useContext } from "react";
import useLocalStorage from "../utils/UseLocalStorage";

import pullCard from '../../assets/sounds/card-sounds-select.mp3';
import selectSound from '../../assets/sounds/button-press.mp3';
import cardClick from '../../assets/sounds/flip-card.mp3';
import pushCard from '../../assets/sounds/page-flip.mp3';
import shuffleCard from '../../assets/sounds/riffle-card-shuffle.mp3';
import celebration from '../../assets/sounds/tadaa.mp3';
import windowBreak from '../../assets/sounds/window-break.mp3';

const SoundContext = createContext();

const sounds = {
  click: selectSound,
  shuffle: shuffleCard,
  drop: pullCard,
  cardClick: cardClick,
  pageFlip: pushCard,
  celebration: celebration,
  break:windowBreak,
};

export function SoundProvider({ children }) {
  const [soundOn, setSoundOn] = useLocalStorage("soundOn", true);
  const [musicOn, setMusicOn] = useLocalStorage("musicOn", true);

  const playSound = (sound) => {
    if (!soundOn) return;

    const soundFile = sounds[sound] || sounds.click;
    const audio = new Audio(soundFile);
    audio.play().catch((err) => {
      console.warn("Failed to play sound:", err);
    });
  };

  return (
    <SoundContext.Provider value={{ soundOn, setSoundOn, musicOn, setMusicOn, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);
