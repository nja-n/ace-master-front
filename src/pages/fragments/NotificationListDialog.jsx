import { useEffect, useState } from "react"
import { fetchNotificationHistory } from "../../components/methods";
import { apiClient } from "../../components/utils/ApIClient";
import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Close } from "@mui/icons-material";
import { tableStyles } from "../../components/Utiliy";

export const NotificationListDialog = ({ setClose }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function fetchHistory() {
            try {
                const response = await apiClient(fetchNotificationHistory, {});
                setHistory(response);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }
        fetchHistory();
    }, []);

    return (
        <Dialog open={true} onClose={() => setClose(false)}
            maxWidth="lg" fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: "linear-gradient(135deg, #0f172a, #1e293b)", // Dark gradient background
                    color: "white",
                },
            }}
        >
            <DialogTitle sx={{ textAlign: "center", color: "gold", fontWeight: "bold" }}>
                Notifications
                <IconButton onClick={() => setClose(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                    <Close sx={{ color: "white" }} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers >
                <TableContainer component={Paper} sx={tableStyles}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Subject</TableCell>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    );
}