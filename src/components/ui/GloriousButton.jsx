import { Button } from '@mui/material';
import { hover } from 'framer-motion';

const GloriousButton = ({ onClick, text, color, id }) => {
    const styles = {
        red: {
            background: 'linear-gradient(180deg, #8B2E1A, #7A1E10)',
            hoverBackground: 'linear-gradient(180deg, #A5331D, #8B2E1A)',
        },
        darkblue: {
            background: 'linear-gradient(180deg, #123C69, #0B2545)',
            hoverBackground: 'linear-gradient(180deg, #1D4E89, #123C69)',
        },
        orange: {
            background: 'linear-gradient(180deg, #000000, #d41717)', // base to darker orange
            hoverBackground: 'linear-gradient(180deg, #FFB733, #FFA500)', // slightly brighter on hover
        }
    };

    const selectedStyle = styles[color] || styles.red;

    return (
        <Button
            id={id}
            disabled={!onClick}
            onClick={onClick}
            variant="contained"
            sx={{
                background: selectedStyle.background,
                border: '2px solid #FFD700',
                color: '#FFD700',
                fontWeight: 'bold',
                fontSize: '1rem',
                padding: '8px 24px',
                borderRadius: '12px',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)',
                textShadow: '1px 1px 2px #000',
                transition: 'all 0.3s ease',
                '&:hover': {
                    background: selectedStyle.hoverBackground,
                    boxShadow: '0 0 10px #FFD700',
                },
            }}
        >
            {text}
        </Button>
    );
};

export default GloriousButton;
