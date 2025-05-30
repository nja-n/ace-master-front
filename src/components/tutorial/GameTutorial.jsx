import { useEffect, useRef, useState } from 'react';
import Joyride from 'react-joyride';

export default function GameTutorial({ joyrideRef, sceneNum }) {
    const [runTutorial, setRunTutorial] = useState(false); // Or load from localStorage to prevent repeat
    const joyReference = useRef();//{ current: null };

    useEffect(() => {
        const tutorialSeen = localStorage.getItem('gameTutorialSeen');

        if (tutorialSeen) {
            const seenScreens = tutorialSeen.split(',').map(s => parseInt(s.trim(), 10));
            console.log('Seen screens:', seenScreens, 'Current scene:', !seenScreens.includes(sceneNum));
            
            if (!seenScreens.includes(sceneNum)) {
                setRunTutorial(true);
            }
        } else {
            setRunTutorial(true);
        }
        
    }, []);

    useEffect(() => {
        if (joyrideRef) {
            if (joyrideRef == 1) {
                setRunTutorial(true);
                console.log('Joyride data:', runTutorial);
                joyrideRef = 2;
            } else {
                setTimeout(() => {
                    joyReference.current.helpers.next(); // ✅ correct way to access helpers  
                    ///joyReference.current.helpers.go(3);
                }, 3500);
            }
        };
    }, [joyrideRef]);


    const handleJoyrideCallback = (data) => {
        const { action, index, type, step, lifecycle, status, helpers } = data;
        const finishedStatuses = ['finished', 'skipped'];

        if (finishedStatuses.includes(status)) {
            setRunTutorial(false);
            const tutorialSeen = localStorage.getItem('gameTutorialSeen');
            localStorage.setItem('gameTutorialSeen',
                tutorialSeen ? tutorialSeen + ',' + sceneNum
                    : sceneNum
            );
        }

    };

    return (
        <>
            <Joyride
                callback={handleJoyrideCallback}
                continuous
                run={runTutorial}
                // scrollToFirstStep

                steps={sceneNum === 1 ? stepsScreen1 : stepsScreen2}
                showProgress
                showSkipButton
                // locale={{ nextLabelWithProgress: 'Next ({step} of {steps})' }}

                disableOverlayClose
                disableOverlay={false}

                ref={joyReference}
                disableScroll={false}
                // stepIndex={stepIndex}
                styles={{
                    options: {
                        zIndex: 10000,
                        backgroundColor: '#333',
                        textColor: '#fff',
                        primaryColor: '#f04',
                    },
                }}
            />
        </>
    );
}

const stepsScreen1 = [
    {
        target: 'body',
        content: 'Hi, Welcome to ACE MASTER!',
        placement: 'center',
    },
    {
        target: '#name-input',
        content: 'Enter your name here to get started.',
    },
    {
        target: '#play-online-button',
        content: 'Click here to play online with others.',
    },
    {
        target: '#play-room-button',
        content: 'Join a room to play with friends.',
    },
    {
        target: '#play-ai-button',
        content: 'Play against our AI opponent.',
    },
];


const stepsScreen2 = [
    {
        content: 'Let\'s start.!',
        placement: 'center',
        target: 'body',
    },
    {
        target: '#player-info',
        content: 'This is your player name and Avatar. It identifies you in the game.',
    },
    {
        target: '#start-button',
        content: 'Start Your Game.',
        disableOverlay: true,       // Allows clicking through the overlay
        spotlightClicks: true,
    },
    {
        target: '#card-selection',
        content: 'Click and Place on a card to select it as your move.',
    },
    {
        target: '#opponent-info',
        content: 'Your opponent\'s name and Avatar are displayed here. You can see their moves once they play.',
    },
    {
        target: '#sort-button',
        content: 'Sort your hands-on Cards.',
    },
    {
        target: '#played-cards',
        content: 'Here you can see the cards that have been played in the current game.',
    },
    {
        target: '#closed-cards',
        content: 'These are the cards that are closed.',
    },
];
