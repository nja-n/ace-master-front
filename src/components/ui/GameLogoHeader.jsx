import { Typography, Box } from '@mui/material';
import capImage from '../../images/confetti-svgrepo-com.svg';

const AceMasterLogo = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 900,
          fontSize: {
            xs: '2rem',
            sm: '3rem',
            md: '4rem',
          },
          color: 'transparent',
          backgroundImage: `linear-gradient(145deg, #ffecb3, #FFD700, #ff9800)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '3px 3px 6px rgba(0,0,0,0.6)',
          fontFamily: '"Cinzel", serif',
          letterSpacing: '0.05em',
        }}
      >
        ACE MASTER
      </Typography>

      {/* Cap image positioned to overlap the "R" */}
      <Box
        component="img"
        src={capImage}
        alt="Birthday Cap"
        sx={{
          position: 'absolute',
          right: {
            xs: -18,
            sm: -25,
            md: -38,
          },
          top: {
            xs: -0,
            sm: -2,
            md: -3,
          },
          width: {
            xs: '40px',
            sm: '60px',
            md: '70px',
          },
          transform: 'rotate(-180deg)',
        }}
      />
    </Box>
  );
};

export default AceMasterLogo;
