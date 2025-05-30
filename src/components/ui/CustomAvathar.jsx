import { Box, Typography } from '@mui/material';

const CustomAvatar = ({ size = 64, letter = 'I', rank }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#0b3d0b', // Dark green shade
        border: '3px solid #FFD700', // Golden border
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      }}
    >
      <Typography
        sx={{
          color: '#f5f5dc',
          fontSize: size * 0.35,
          fontWeight: 600,
          fontFamily: '"Cinzel", helvetica, sans-serif',
          textTransform: 'uppercase',
        }}
      >
        {letter}
      </Typography>

      {rank && (
        <Box
          sx={{
            position: 'absolute',
            bottom: -8,
            right: -8,
            backgroundColor: '#FFD700',
            borderRadius: '50%',
            width: size * 0.4,
            height: size * 0.4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
          }}
        >
          <Typography
            sx={{
              fontSize: size * 0.2,
              fontWeight: 'bold',
              color: '#0b3d0b',
            }}
          >
            {rank}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CustomAvatar;
