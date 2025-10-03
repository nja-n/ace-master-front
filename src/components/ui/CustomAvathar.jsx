import { Settings } from '@mui/icons-material';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { use, useEffect, useState } from 'react';
import { SettingsDialog } from '../../pages/fragments/SettingsDialog';
import { motion } from 'framer-motion';
import { apiClient } from '../utils/ApIClient';
import { readProfileImage } from '../methods';

const CustomAvatar = ({ size = 64, letter = 'I', rank, settings = false, user }) => {
  const [openSettings, setOpenSettings] = useState(false);
  const [hasImage, setHasImage] = useState(null);

  useEffect(() => {
    async function fetchImg() {
      try {
        const img = await apiClient(readProfileImage, { method: 'GET' });
        if (img) {
          setHasImage(img.imageUrl);
        }
      } catch (err) {
        setHasImage(null);
      }
    }
    fetchImg();
  }, [user]);

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
        boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
        // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      }}
    >
      {settings &&
        <IconButton
          onClick={() => setOpenSettings(true)}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bgcolor: "rgba(30,41,59,0.8)",
            "&:hover": { bgcolor: "rgba(30,41,59,1)" },
            width: 36,
            height: 36,
          }}
        >
          <motion.div
            animate={{ rotate: openSettings ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <Settings sx={{ color: "gold", fontSize: 24 }} />
          </motion.div>
        </IconButton>
      }
      {hasImage ? (
        <Avatar
          src={hasImage}
          alt={user?.firstName || "U"}
          sx={{
            width: size / 1.05,
            height: size / 1.05,
            borderRadius: "50%",
          }}
        />
      ) : (
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
      )}

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
      {openSettings &&
        <SettingsDialog
          setOpenSettings={setOpenSettings}
          user={user} />}
    </Box>
  );
};

export default CustomAvatar;
