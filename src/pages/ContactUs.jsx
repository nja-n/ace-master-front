import { WebStoriesRounded } from "@mui/icons-material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Box, Button, IconButton, Link, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { apiClient } from "../components/utils/ApIClient";
import { feedback, pre } from "../components/methods";

const ContactUs = () => {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let tempErrors = { name: "", email: "", message: "" };
        let valid = true;

        if (!form.name.trim()) {
            tempErrors.name = "Name is required";
            valid = false;
        }

        if (!form.email.trim()) {
            tempErrors.email = "Email is required";
            valid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                tempErrors.email = "Invalid email format";
                valid = false;
            }
        }

        if (!form.message.trim()) {
            tempErrors.message = "Message is required";
            valid = false;
        }

        setErrors(tempErrors);

        if (!valid) return;

        const confirmed = await window.confirm("Are you sure you want to submit this feedback?");
        if (!confirmed) return;

        try {
            const response = await apiClient(feedback, {
                method: "POST",
                body: form,
            });
            if (response.status === "success") {
                alert("Feedback submitted successfully!");
            }

            setForm({ name: "", email: "", message: "" });
            setErrors({ name: "", email: "", message: "" });
        } catch (err) {
            console.error("Error submitting form:", err);
            alert("Failed to submit feedback. Please try again later.");
        }
    };



    return (
        <Box sx={{ mx: "auto", mt: 5, px: 3 }}>
            <Typography variant="h4" gutterBottom textAlign="center"
                color="#fff">
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
                    href={`${pre}public/status`}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ display: "flex", alignItems: "center", ml: 1 }}
                >
                    <WebStoriesRounded/>API
                </Link>
            </Box>

            <Box>
                <Box display="flex" gap={1}>
                    <TextField
                        label="Your Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        variant="filled"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 1,
                        }}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
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
                        variant="filled"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 1,
                        }}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                    />
                </Box>
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
                    variant="filled"
                    sx={{
                        backgroundColor: "#fff",
                        borderRadius: 1,
                    }}
                    error={Boolean(errors.message)}
                    helperText={errors.message}

                />

                <Button onClick={handleSubmit} variant="contained" fullWidth sx={{ mt: 2 }}>
                    Submit Feedback
                </Button>
            </Box>
        </Box>
    );
};

export default ContactUs;
