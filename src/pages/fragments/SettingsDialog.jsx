import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpringSwitch } from "../../components/ui/SpringSwitch";
import { useLoading } from "../../components/LoadingContext";
import { getDeviceInfo } from "../../components/Utiliy";
import { apiClient } from "../../components/utils/ApIClient";
import { saveUser } from "../../components/methods";

export const SettingsDialog = ({ setOpenSettings, user }) => {
  const [activeTab, setActiveTab] = useState(0);

  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);

  const [changedName, setChangedName] = useState("");
  const {setLoading} = useLoading();


  const tabVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const handleChange = (e, newValue) => {
    setDirection(newValue > activeTab ? 1 : -1);
    setActiveTab(newValue);
  };

  const handleSave = async () => {
      if (changedName.trim()) {
        setLoading(true);
        const deviceInfo = await getDeviceInfo();
        try {
          const payload = {
            id: user.id,
            firstName: changedName,
            os: deviceInfo.platform,
            platform: deviceInfo.userAgent,
            screenWidth: deviceInfo.screenWidth,
            screenHeight: deviceInfo.screenHeight
          };
  
          const response = await apiClient(saveUser, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: payload,
            refreshOnSuccess: true,
          });
  
          if (!response) throw new Error("Failed to save user");
  
          const data = await response;
  
          alert('Player Name have been saved.');
  
        } catch (error) {
          alert('something went wrong, please try again');
          console.error("Error saving user:", error);
          setLoading(false);
        }
        setOpenSettings(false);
        setLoading(false);
      }
    };

  return (
    <Dialog
      open={true}
      onClose={() => setOpenSettings(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #0f172a, #1e293b)", // Dark gradient background
          color: "white",
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        Settings
        <IconButton
          aria-label="close"
          onClick={() => setOpenSettings(false)}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Close sx={{ color: "#f1f5f9" }} />
        </IconButton>
      </DialogTitle>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleChange}
        centered
        variant="fullWidth"
        TabIndicatorProps={{ style: { backgroundColor: "#06b6d4" } }}
        sx={{
          "& .MuiTab-root": {
            color: "#94a3b8",
            fontWeight: "bold",
          },
          "& .Mui-selected": {
            color: "#06b6d4 !important",
          },
        }}
      >
        <Tab label="Profile" />
        <Tab label="Sound" />
      </Tabs>

      {/* Animated Tab Content */}
      <DialogContent dividers>
        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === 0 ? (
            <motion.div
              key="profile"
              custom={direction}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>Name</Typography>
                  <TextField
                    value={changedName}
                    onChange={(e) => setChangedName(e.target.value)}
                    size="small"
                    variant="standard"
                    InputProps={{
                      style: {
                        color: "white",
                        fontSize: "1.25rem",
                        fontWeight: 500,
                      },
                    }}
                    sx={{
                      width: "50%",
                      mb: 1,
                      "& .MuiInputBase-input": { padding: 0 },
                      "& .MuiInput-underline:before": {
                        borderBottomColor: "gray",
                      },
                      "& .MuiInput-underline:hover:before": {
                        borderBottomColor: "orange !important",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottomColor: "yellow",
                      },
                    }}
                  />
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button
                    onClick={()=>handleSave()}
                    variant="outlined"
                    color="info"
                    sx={{
                      border: "2px solid #FFD700",
                      color: "#FFD700",
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "4px 12px",
                      borderRadius: "12px",
                      boxShadow:
                        "inset 0 1px 3px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.3)",
                      textShadow: "1px 1px 2px #000",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 0 10px #FFD700",
                      },
                    }}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </motion.div>
          ) : (
            <motion.div
              key="sound"
              custom={direction}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>Sound Effects</Typography>
                  <SpringSwitch
                    checked={soundOn}
                    onChange={(val) => setSoundOn(val)}
                  />
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>Background Music</Typography>
                  <SpringSwitch
                    checked={soundOn}
                    onChange={(val) => setSoundOn(val)}
                  />
                </Stack>
              </Stack>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
