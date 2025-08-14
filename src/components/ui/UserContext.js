import React, { createContext, useState, useEffect, useContext } from "react";
import { userByToken } from "../methods";
import { apiClient } from "../ApIClient";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await apiClient(userByToken, {
                    method: 'POST',
                });

                const data = res;//await res.json();
                setUser(data);
            } catch (err) {
                console.error("Failed to load user:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
