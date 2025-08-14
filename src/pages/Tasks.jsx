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

const Tasks = () => {
    const [user, setUser] = useState(null);
    const [storedId, setStoredId] = useState("");
    const [dailyTask, setDailyTask] = useState([]);
    const { setLoading } = useLoading();

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


            setStoredId(localStorage.getItem("userId"));

            fetch(fetchUser + '?id=' + storedId, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUser(data);
                })
                .catch((error) => {
                    console.error("Error loading user:", error);
                });
    }, []);

    return (
        <Box
            sx={{ mx: "auto", mt: 5, px: 3 }}
        >
            <CommonHeader coinBalance={20000}/>
            
            <AdBanner/>
            <DailyTaskBox tasks={dailyTask}/>

            {/* User Info */}
            <Box sx={{ textAlign: "center", marginTop: "20px" }}>
                <Avatar
                    sx={{
                        width: 150,
                        height: 150,
                        border: "3px solid white",
                        fontSize: "50px",
                        bgcolor: "#1b5e20",
                        margin: "auto",
                    }}
                >
                    {(user?.userName)?.charAt(0).toUpperCase() || "?"}
                </Avatar>

            </Box>
        </Box>
    );
};

export default Tasks;