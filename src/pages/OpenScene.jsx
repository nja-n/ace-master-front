import { CardMedia } from "@mui/material";
import { useEffect, useState } from 'react';
import { useUser } from '../components/ui/UserContext';
import logo from '../images/1000102291.png';
import Home from './Home';

const OpenScene = ({forceSplash = false}) => {
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (forceSplash) return; 
        try {
            setShowSplash(false); // If user is logged in, skip splash screen
            const splashTimestamp = localStorage.getItem('splashTimestamp');

            if (splashTimestamp) {
                const currentTime = Date.now();
                const timeDiff = currentTime - splashTimestamp;

                if (timeDiff > 3600000) {
                    localStorage.removeItem('splashTimestamp');
                } else {
                    setShowSplash(false); // If not, skip splash screen
                }
            }
            const timer = setTimeout(() => {
                setShowSplash(false);
                localStorage.setItem('splashTimestamp', Date.now().toString());
            }, 2000);

            return () => clearTimeout(timer);
        } catch (error) {
            console.error("Error in OpenScene useEffect:", error);
            alert("An error occurred while loading the application. Please try again later.");
        }
    }, []);

    return (
        <div>
            {showSplash ? (
                // Splash screen with the logo
                <>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100vh', // Ensure the container takes full height of the viewport
                            //background: 'linear-gradient(to bottom,rgb(5, 63, 5), #006400)', // Green gradient background
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={logo}
                            alt="Logo"
                            sx={{ width: 'auto', height: 'auto', maxWidth: '80%', maxHeight: '80%' }} // Adjust image size as needed
                        />
                    </div>
                </>

            ) : (
                <Home />
            )}
        </div>
    );

};

export default OpenScene;
