import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { userByToken } from "../methods";
import { apiClient } from "../utils/ApIClient";
import { on } from "../utils/eventBus";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [notifDialogOpen, setNotifDialogOpen] = useState(false);
    const [currentNotifIndex, setCurrentNotifIndex] = useState(0);
    const [notifications, setNotifications] = useState([]);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient(userByToken, { method: "POST" });
            setUser(res);

            if (res?.userNotifications && res.userNotifications.length > 0) {
                setNotifications(res.userNotifications);
                setCurrentNotifIndex(0);
                setNotifDialogOpen(true);
            }

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
            
            <Dialog open={notifDialogOpen} onClose={handleCloseNotif}>
                <DialogTitle sx={{ m: 0, p: 2 }}>
                    Notification {currentNotifIndex + 1} of {notifications.length}
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
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Typography>
                        {notifications[currentNotifIndex]?.message ||
                            JSON.stringify(notifications[currentNotifIndex])}
                    </Typography>
                </DialogContent>
            </Dialog>
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
