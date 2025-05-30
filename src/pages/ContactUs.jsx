import { ArrowBack } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter"; // X is represented by TwitterIcon
import { AppBar, Box, Button, IconButton, Link, TextField, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AceMasterLogo from "../components/ui/GameLogoHeader";

const ContactUs = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can integrate backend or email API here
        console.log("Submitted:", form);
        alert("Thanks for your feedback!");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, px: 3 }}>
            <AppBar position="static" sx={{ backgroundColor: "#000000", border: "2px solid #FFD700", boxShadow: "0 0 10px #FFD700", borderRadius: "12px", mb: 3 }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Back Button */}
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => navigate("/")}
                    >
                        <ArrowBack />
                    </IconButton>

                    <AceMasterLogo />

                    {/* Empty space for alignment */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Social Media Icons */}

                </Toolbar>
            </AppBar>
            <Typography variant="h4" gutterBottom textAlign="center">
                Contact Us
            </Typography>

            <Box display="flex" justifyContent="center" gap={2} mb={3}>
                <IconButton
                    component="a"
                    href="https://www.facebook.com/share/19JKJKG2SY"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FacebookIcon color="primary" />
                </IconButton>
                <IconButton
                    component="a"
                    href="https://instagram.com/aeit.her"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <InstagramIcon color="secondary" />
                </IconButton>
                {/* <IconButton
                    component="a"
                    href="https://x.com/yourpage"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <TwitterIcon />
                </IconButton> */}
                <Link
                    href="https://aetheracemaster.onrender.com/cards"
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center", ml: 1 }}
                >
                    View Web API
                </Link>
            </Box>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Your Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />
                <TextField
                    label="Your Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    margin="normal"
                    required
                />

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Submit Feedback
                </Button>
            </form>
        </Box>
    );
};

export default ContactUs;
