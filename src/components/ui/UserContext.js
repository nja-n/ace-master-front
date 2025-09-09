import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from "react";
import { pre, userByToken } from "../methods";
import { apiClient } from "../utils/ApIClient";
import { on } from "../utils/eventBus";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import DailyTaskBox from "../../pages/fragments/DailyTaskBox";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [notifDialogOpen, setNotifDialogOpen] = useState(false);
    const [currentNotifIndex, setCurrentNotifIndex] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const firstCall = useRef(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const body = firstCall.current ? { notes: "yes" } : null;
            const res = await apiClient(userByToken, {
                method: "POST",
                body: body,
            });
            setUser(res);

            if (firstCall.current && res?.notifications && res.notifications.length > 0) {
                setNotifications(res.notifications);
                setCurrentNotifIndex(0);
                setNotifDialogOpen(true);
            } else {
                console.log("First Call:", firstCall);
            }
            firstCall.current = false;

        } catch (err) {
            console.error("Failed to load user:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
        // 👇 Listen for "user:refresh" events from apiClient
        const unsubscribe = on("user:refresh", fetchUser);
        return () => unsubscribe();
    }, [fetchUser]);

    const handleCloseNotif = () => {
        if (currentNotifIndex < notifications.length - 1) {
            setCurrentNotifIndex((prev) => prev + 1);
        } else {
            setNotifDialogOpen(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser: fetchUser }}>
            {children}

            <Dialog 
                open={notifDialogOpen} 
                onClose={handleCloseNotif}
                maxWidth
                PaperProps={{
                    sx: {
                        backgroundColor: "transparent",   // make the paper itself transparent
                        boxShadow: "none",                // remove the shadow
                    },
                }}
            // BackdropProps={{
            //     style: { backgroundColor: "transparent" }, // remove dark backdrop
            // }}
            >
                <DialogTitle sx={{ m: 0, p: 2 }}
                    justifyContent={"center"}
                    display="flex"
                    alignItems="center"
                    color="white">
                    <Box></Box>
                    {currentNotifIndex + 1} of {notifications.length}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseNotif}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                {notifications[currentNotifIndex]?.actionDestination &&
                    notifications[currentNotifIndex]?.actionDestination !== 'rewards' ?
                    <DialogContent dividers>
                        {notifications[currentNotifIndex]?.image && (
                            <img
                                src={pre + notifications[currentNotifIndex].image}
                                alt="notification"
                                style={{ maxWidth: "100%", borderRadius: "12px" }}
                            />
                        )}
                        <Typography>
                            {notifications[currentNotifIndex]?.message ||
                                JSON.stringify(notifications[currentNotifIndex])}
                        </Typography>
                    </DialogContent> :
                    <DialogContent dividers>
                        <DailyTaskBox  />
                    </DialogContent>
                }
            </Dialog>
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
