import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import CustomAvatar from './CustomAvathar';
import GlassShatterSVG from '../../components/force/need/GlassShatterSVG'

const PlayerAvatarWithTimer = ({ gameData, player, timeLeft, breaks }) => {
  const isCurrentTurn = gameData.turnIndex === player.gameIndex;
  const displayLetter = player.gameIndex;
  const rank = player.winningRank ? getOrdinalSuffix(player.winningRank) : null;

  return (
    <>
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
                rank={null}
                textColor={timeLeft > 5 ? '#ffffff' : '#ff1744'}
                pid={player.id}
              />
            </Box>
            {breaks && (
              <Box
                className="glass-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 64,
                  height: 64,
                }}
              />
            )}
          </>
        ) : (
          <CustomAvatar size={64} letter={displayLetter} rank={rank}
            pid={player.id}
          />
        )}
      </Box>
      {breaks !== -1 && (
        <GlassShatterSVG
          size={64}
          trigger={breaks}
          shardCount={60}
          radiusMultiplier={1.8}
          onComplete={() => console.log('Cutting Animation Played')}
        />
      )}
    </>
  );
};

export default PlayerAvatarWithTimer;

function getOrdinalSuffix(rank) {
  if (rank === 0) return 'Looser';
  const j = rank % 10,
    k = rank % 100;
  if (j === 1 && k !== 11) return `🥇 ${rank}st\n-`;
  if (j === 2 && k !== 12) return `🥈 ${rank}nd\n-`;
  if (j === 3 && k !== 13) return `🥉 ${rank}rd\n-`;
  return `${rank}th\n-`;
}
