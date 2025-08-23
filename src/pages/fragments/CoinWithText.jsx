import React from 'react';
import { Box, Typography } from '@mui/material';
import CoinIcon from '../../images/aeither_coin.png';
import { useNavigate } from 'react-router-dom';

export default function CoinWithText({ coinBalance }) {
    const navigate = useNavigate();
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexDirection: 'column' }}>
            <img
                src={CoinIcon}
                alt="Coin"
                onClick={() => navigate('/profile')}
                style={{ width: '24px', height: '24px', marginRight: '0px' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {coinBalance}
            </Typography>
        </Box>
    );
}