import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { userByToken } from "../methods";
import { apiClient } from "../utils/ApIClient";
import { on } from "../utils/eventBus";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient(userByToken, { method: "POST" });
            setUser(res);
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

    return (
        <UserContext.Provider value={{ user, setUser, loading, refreshUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
