import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import CustomAvatar from './CustomAvathar'; // Make sure this is imported correctly

const PlayerAvatarWithTimer = ({ gameData, clientPlayer, timeLeft, playerName, getOrdinalSuffix }) => {
  const isCurrentTurn = gameData.turnIndex === clientPlayer.gameIndex;
  const displayLetter = playerName?.charAt(0)?.toUpperCase() || '?';
  const rank = clientPlayer.winningRank ? getOrdinalSuffix(clientPlayer.winningRank) : null;

  return (
    <Box position="relative" display="inline-flex">
      {isCurrentTurn ? (
        <>
          <CircularProgress
            size={64}
            thickness={5}
            color="secondary"
            variant="determinate"
            value={(timeLeft * 100) / 15}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CustomAvatar
              size={50}
              letter={timeLeft > 0 ? timeLeft : displayLetter}
              rank={null} // No rank during timer
              textColor={timeLeft > 5 ? '#ffffff' : '#ff1744'}
            />
          </Box>
        </>
      ) : (
        <CustomAvatar size={64} letter={displayLetter} rank={rank} />
      )}
    </Box>
  );
};

export default PlayerAvatarWithTimer;
