import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Tabs,
    Tab,
    Slide,
    Box,
} from "@mui/material";

const RoomSessionModal = ({ open, onClose, onJoin, onCreate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [roomIdInput, setRoomIdInput] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: "linear-gradient(135deg, #0f172a, #1e293b)", // Dark gradient background
          color: "white"
        }
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.2rem",
          color: "#f1f5f9"
        }}
      >
        {activeTab === 0 ? "Join a Room" : "Create a Room"}
      </DialogTitle>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        centered
        variant="fullWidth"
        TabIndicatorProps={{ style: { backgroundColor: "#06b6d4" } }}
        sx={{
          "& .MuiTab-root": {
            color: "#94a3b8",
            fontWeight: "bold"
          },
          "& .Mui-selected": {
            color: "#06b6d4 !important"
          }
        }}
      >
        <Tab label="Join" />
        <Tab label="Create" />
      </Tabs>

      {/* Content */}
      <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.1)" }}>
        {activeTab === 0 ? (
          <TextField
            autoFocus
            margin="dense"
            label="Room ID"
            type="text"
            variant="outlined"
            inputProps={{ maxLength: 5, inputMode: "numeric", pattern: "[0-9]*" }}
            fullWidth
            value={roomIdInput}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) setRoomIdInput(value);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "#475569" },
                "&:hover fieldset": { borderColor: "#06b6d4" },
                "&.Mui-focused fieldset": { borderColor: "#06b6d4" }
              },
              "& .MuiInputLabel-root": {
                color: "#94a3b8"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#06b6d4"
              }
            }}
          />
        ) : (
          <Box sx={{ textAlign: "center", p: 2, color: "#cbd5e1" }}>
            <p>Click below to create a new game room.</p>
          </Box>
        )}
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          borderTop: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#94a3b8",
            "&:hover": { color: "#e2e8f0", backgroundColor: "rgba(148,163,184,0.1)" }
          }}
        >
          Cancel
        </Button>

        {activeTab === 0 ? (
          <Button
            onClick={() => onJoin(roomIdInput)}
            variant="contained"
            disabled={roomIdInput.length < 5}
            sx={{
              backgroundColor: "#06b6d4",
              "&:hover": { backgroundColor: "#0891b2" },
              borderRadius: "8px",
              px: 3
            }}
          >
            Join
          </Button>
        ) : (
          <Button
            onClick={onCreate}
            variant="contained"
            sx={{
              backgroundColor: "#06b6d4",
              "&:hover": { backgroundColor: "#0891b2" },
              borderRadius: "8px",
              px: 3
            }}
          >
            Create
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};


export default RoomSessionModal;