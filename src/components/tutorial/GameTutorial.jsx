import { useEffect, useRef, useState } from 'react';
import Joyride from 'react-joyride';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GameTutorial({onStartGame}) {
  const navigate = useNavigate();
  const location = useLocation();
  const joyReference = useRef();

  const [runTutorial, setRunTutorial] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentScene, setCurrentScene] = useState(1); // 1 = screen1, 2 = screen2

  // 🧠 Load tutorial state from localStorage or start fresh
  useEffect(() => {
    const seen = localStorage.getItem('gameTutorialSeen');

    // if already completed both scenes, skip
    if (seen === 'done') return;

    if (location.pathname.includes('/play/bot')) {
      setSteps(stepsScreen2);
      setCurrentScene(2);
      setRunTutorial(true);
    } else {
      setSteps(stepsScreen1);
      setCurrentScene(1);
      setRunTutorial(true);
    }
  }, [location.pathname]);

  const handleJoyrideCallback = (data) => {
    const { status, index, type, lifecycle, helpers } = data;
    const finishedStatuses = ['finished', 'skipped'];

    // 🟡 When user reaches last step in screen 1 → move to next page
    if (currentScene === 1 && type === 'step:after' && index === stepsScreen1.length - 1) {
      navigate('/play/bot');
      // small delay so new page elements render
      setTimeout(() => {
        setSteps(stepsScreen2);
        setCurrentScene(2);
        setRunTutorial(true);
      }, 600);
      return;
    }

    // 🟢 When done with second screen, stop tutorial
    if (lifecycle === 'complete' && index === 2) { // Step index 2 (your #start-button)
      if (typeof onStartGame === 'function') {
        onStartGame();
      }
    }
    if (currentScene === 2 && finishedStatuses.includes(status)) {
      setRunTutorial(false);
      localStorage.setItem('gameTutorialSeen', 'done');
    }
  };

  return (
    <>
      <Joyride
        ref={joyReference}
        callback={handleJoyrideCallback}
        run={runTutorial}
        steps={steps}
        continuous
        showProgress
        showSkipButton
        hideCloseButton
        disableOverlayClose
        disableScroll={false}
        styles={{
          options: {
            arrowColor: "#2a261d",
            backgroundColor: "#2a261d",
            primaryColor: "#FFD700",
            textColor: "#f5d47a",
            overlayColor: "rgba(0,0,0,0.6)",
            zIndex: 10000,
          },
          tooltipContainer: {
            background: "#2a261d",
            border: "1px solid #d4af37",
            borderRadius: "12px",
            color: "#f5d47a",
            boxShadow: "0 0 12px rgba(255, 215, 0, 0.3)",
            padding: "12px 16px",
          },
          tooltipTitle: {
            color: "#FFD700",
            fontWeight: "bold",
          },
          buttonNext: {
            backgroundColor: "#FFD700",
            color: "#1b1a17",
            border: "1px solid #bfa133",
            borderRadius: "8px",
            padding: "6px 14px",
            fontWeight: "600",
          },
          buttonBack: {
            backgroundColor: "transparent",
            color: "#f5d47a",
            border: "1px solid #bfa133",
            borderRadius: "8px",
            padding: "6px 14px",
            marginRight: "8px",
            fontWeight: "500",
          },
          buttonSkip: {
            backgroundColor: "transparent",
            color: "#f5d47a",
            textDecoration: "underline",
            marginRight: "8px",
          },
        }}
      />
    </>
  );
}

/* 🎯 Screen 1 Steps (Lobby / Menu) */
const stepsScreen1 = [
  {
    target: 'body',
    content: 'Hi, Welcome to ACE MASTER!',
    placement: 'center',
  },
  {
    target: 'body',
    content: 'Let me guide you through a quick tutorial to get you started.',
    placement: 'center',
  },
  {
    target: '#play-online-button',
    content: 'Click here to play online with others.',
  },
  {
    target: '#play-quick-button',
    content: 'Play Unknown duo with 26 cards.',
  },
  {
    target: '#play-room-button',
    content: 'Create or Join a room to play with friends.',
  },
  {
    target: '#play-ai-button',
    content: 'Play against our BOT opponent.',
  },
];

/* 🎮 Screen 2 Steps (Inside Game) */
const stepsScreen2 = [
  {
    content: "Let's start!",
    placement: 'center',
    target: 'body',
  },
  {
    target: '#player-info',
    content: 'This is your player name and Avatar. It identifies you in the game.',
  },
  {
    target: '#start-button',
    content: 'Start your game.',
    // disableOverlay: true,
    // spotlightClicks: true,
  },
  {
    // target: '#opponent-info',
    placement: 'center',
    target: 'body',
    content:
      "Here the table with opponent's and cards. You can see opponent moves once they play and played cards.",
  },
  {
    target: '#client-player-cards',
    content: 'Click and place a card to select it as your move.',
  },
  {
    target: '#sort-button',
    content: 'Sort your hand cards easily with this button.',
  },
  {
    target: '#table-cards',
    content: 'Here you can see the cards that have been played in the current game.',
  },
  {
    target: '#closed-cards',
    content: 'These are the cards that are closed.',
  },
];
