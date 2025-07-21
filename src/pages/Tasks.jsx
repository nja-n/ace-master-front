import React, { useState, useEffect } from "react";
import {
    Avatar, Button, Container, Typography, Box, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchUser } from '../components/methods';
import DailyTaskBox from "./fragments/DailyTaskBox";
import AdBanner from "../components/adsterBanner";
import bgGreenTable from '../images/bg-green-table.png';

const Tasks = () => {
    const [user, setUser] = useState(null);
    const [storedId, setStoredId] = useState(localStorage.getItem("userId") || "");
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const isMobile = window.innerWidth < 600;

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    useEffect(() => {
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

    

    const handleMenuSelected = (i) => {
        switch (i) {
            case 1:
                navigate('/tasks');
                break;
            case 2:
                navigate('/about');
                break;
            case 3:
                window.location.href = "mailto:aether.cash@hotmail.com?subject=Support Request&body=Hello, I need assistance with...";
                break;
            case 4:
                window.location.href = "mailto:aether.cash@hotmail.com?subject=Contact Request&body=Hello, I need assistance with...";
                break;
            default:
                alert('Please select correct action');
        }
    };

    const testToken = async () => {
        let storedId = 21;
        await fetch(fetchUser + '?id=' + storedId, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include', // Include credentials for CORS requests
        })
            .then((response) => response.json())
            .then((data) => {
                setUser(data);
            })
            .catch((error) => {
                console.error("Error loading user:", error);
            });
        alert('Token: ' + user?.token);
        
    }

    return (
        <Box
            sx={{
                backgroundColor: "#2e7d32",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundImage: `url(${bgGreenTable})`,
                backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
            }}
            
        >
            {/* AppBar */}
            <AppBar position="static" sx={{ backgroundColor: "#1b5e20",
                marginTop:'10px',
             }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between",
                     marginLeft:'15px', marginRight:'15px',
                 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Ace Master
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }} onClick={() => testToken()} style={{ cursor: 'pointer' }}>
                        Coin <Typography component="span" sx={{ fontWeight: "bold", color: "#ff9800" }}>{user?.coinBalance}</Typography>
                    </Typography>

                    {/* Desktop Buttons */}
                    <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
                        {/* <Button color="inherit" onClick={() => handleMenuSelected(1)}>Chat</Button> */}
                        <Button color="inherit" onClick={() => handleMenuSelected(1)}>Task</Button>
                        <Button color="inherit" onClick={() => handleMenuSelected(2)}>About</Button>
                        <Button color="inherit" onClick={() => handleMenuSelected(4)}>Contact Us</Button>
                    </Box>

                    {/* Mobile Menu */}
                    <IconButton edge="end" color="inherit" onClick={handleMenuOpen} sx={{ display: { xs: "block", sm: "none" } }}>
                        <MoreVert />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => { handleMenuSelected(1); handleMenuClose(); }}>Task</MenuItem>
                        <MenuItem onClick={() => { handleMenuSelected(2); handleMenuClose(); }}>About</MenuItem>
                        <MenuItem onClick={() => { handleMenuSelected(4); handleMenuClose(); }}>Contact Us</MenuItem>
                    </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            <AdBanner/>
            <DailyTaskBox/>

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