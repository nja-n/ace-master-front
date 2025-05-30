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

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            // TransitionComponent={Transition}
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle sx={{ textAlign: 'center' }}>
                {activeTab === 0 ? "Join a Room" : "Create a Room"}
            </DialogTitle>

            <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                centered
                variant="fullWidth"
            >
                <Tab label="Join" />
                <Tab label="Create" />
            </Tabs>

            <DialogContent dividers>
                {activeTab === 0 ? (
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room ID"
                        type="text"
                        inputProps={{ maxLength: 5, inputMode: 'numeric', pattern: '[0-9]*' }}
                        fullWidth
                        value={roomIdInput}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) setRoomIdInput(value);
                        }}
                    />
                ) : (
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                        <p>Click below to create a new game room.</p>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {activeTab === 0 ? (
                    <Button
                        onClick={() => onJoin(roomIdInput)}
                        variant="contained"
                        color="primary"
                        disabled={roomIdInput.length < 5}
                    >
                        Join
                    </Button>
                ) : (
                    <Button
                        onClick={onCreate}
                        variant="contained"
                        color="primary"
                    >
                        Create
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default RoomSessionModal;