import React, { useState, useEffect } from "react";
import {
    Avatar, Button, Container, Typography, Box, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchDailyTasks, fetchUser } from '../components/methods';
import DailyTaskBox from "./fragments/DailyTaskBox";
import AdBanner from "../components/adsterBanner";
import CommonHeader from "../components/ui/CommonHeader";
import { useLoading } from "../components/LoadingContext";
import { apiClient } from "../components/ApIClient";
import { useUser } from "../components/ui/UserContext";

const Tasks = () => {
    const [dailyTask, setDailyTask] = useState([]);
    const { setLoading } = useLoading();
    const { user, setUser } = useUser();

    useEffect(() => {
        setLoading(true);

        const loadDailyTasks = async () => {
            try {
                const response = await apiClient(fetchDailyTasks);
                setDailyTask(response);
            } catch (error) {
                console.error("Error loading daily tasks:", error);
            } finally {
                setLoading(false);
            }
        }
        loadDailyTasks();
    }, []);

    const updateBalance = async (coin) => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            coinBalance: prev.coinBalance + coin,
        }));
    }

    return (
        <Box
            sx={{ mx: "auto", mt: 5, px: 3 }}
        >
            <CommonHeader coinBalance={user?.coinBalance} />
            <AdBanner />
            <DailyTaskBox tasks={dailyTask} updateBalance={updateBalance} />
            {/* Placeholder for future tasks */}
            <Box
                sx={{
                    mt: 5,
                    py: 3,
                    textAlign: "center",
                    border: "2px dashed #ccc",
                    borderRadius: 2
                }}
            >
                <Typography variant="h6" color="grey">
                    🔒 More tasks will be updated later
                </Typography>
            </Box>
        </Box>
    );
};

export default Tasks;