// FacebookLogin.jsx
import { useEffect } from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Button } from '@mui/material';

const FacebookLogin = ({ onLogin }) => {
    useEffect(() => {
        // Load Facebook SDK
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: '1829187297625427',
                cookie: true,
                xfbml: false,
                version: 'v19.0',
            });
        };

        (function (d, s, id) {
            if (d.getElementById(id)) return;
            const js = d.createElement(s);
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js';
            d.body.appendChild(js);
        })(document, 'script', 'facebook-jssdk');
    }, []);

    const handleLogin = () => {
        window.FB.login(
            function (response) {
                if (response.authResponse) {
                    console.log('Facebook login success', response);
                    const accessToken = response.authResponse.accessToken;
                    onLogin(accessToken); // send token to backend
                } else {
                    console.error('Facebook login failed');
                }
            },
            { scope: 'email,public_profile' }
        );
    };

    return (
        <Button
            variant="contained"
            startIcon={<FacebookIcon />}
            onClick={handleLogin}
            sx={{
                backgroundColor: '#1877F2',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#145dbf'
                },
                fontWeight: 'bold'
            }}
            fullWidth
        >
            Connect with Facebook
        </Button>
    );
};

export default FacebookLogin;
