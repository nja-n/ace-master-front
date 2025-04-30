import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/1000102291.png';
import { CardMedia } from "@mui/material";
import Home from './Home';

const OpenScene = () => {
    const [showSplash, setShowSplash] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSplash(false);
            //navigate('/home');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

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
                            background: 'linear-gradient(to bottom,rgb(5, 63, 5), #006400)', // Green gradient background
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
                    <Home/>
            )}
        </div>
    );

};

export default OpenScene;
