import { Close, KeyboardArrowDown } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchGameLedger } from "../../components/methods";
import { apiClient } from "../../components/utils/ApIClient";

export const LedgerDialog = ({ view, setOpenCoin, setOpenGame, user }) => {
    const [gameHistory, setGameHistory] = useState([]);
    const [openRow, setOpenRow] = useState(-1);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await apiClient(fetchGameLedger, {});
                setGameHistory(response);
                console.log(response);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }
        fetchProfile();
    }, []);

    return (
        <>
            <Dialog open={view === "game"} onClose={() => setOpenGame(false)}
                maxWidth="lg" fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        background: "linear-gradient(135deg, #0f172a, #1e293b)", // Dark gradient background
                        color: "white",
                    },
                }}>
                <DialogTitle sx={{ textAlign: "center", color: "gold", fontWeight: "bold" }}>
                    Game Ledger
                    <IconButton onClick={() => setOpenGame(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <Close sx={{ color: "white" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers >
                    <TableContainer component={Paper} sx={tableStyles}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Session ID</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Date & Time</TableCell>
                                    <TableCell>Used Coins</TableCell>
                                    <TableCell>Earned Coins</TableCell>
                                    <TableCell>Your Rank</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gameHistory.map((row) => {
                                    // format date
                                    const formattedDate = row.startedOn
                                        ? new Date(row.startedOn).toLocaleString()
                                        : "-";

                                    const usedCoins = row.totalPrizeAmount / row.players.split(",").length;
                                    let rank = row.winningOrder?.split(",").indexOf(String(user));
                                    rank = rank != null ? rank+1 : null;

                                    return (
                                        <>
                                            <TableRow key={row.id}>
                                                <TableCell>{row.sessionId.slice(0, 6)}...</TableCell>
                                                <TableCell>{row.roomId ? "Room" : "Classic"}</TableCell>
                                                <TableCell>{formattedDate}</TableCell>
                                                <TableCell>{usedCoins ?? 0}</TableCell>
                                                <TableCell sx={{ color: "gold" }}>{row.earnedCoin ?? 0}</TableCell>
                                                <TableCell>{rank ?? "-"}</TableCell>
                                                <TableCell align="center">
                                                    <motion.div
                                                        animate={{ rotate: openRow === row.id ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setOpenRow(openRow === row.id ? null : row.id)}
                                                        >
                                                            <KeyboardArrowDown sx={{ color: "gold" }} />
                                                        </IconButton>
                                                    </motion.div>
                                                </TableCell>
                                            </TableRow>

                                            {openRow === row.id && (
                                                <TableRow>
                                                    <TableCell colSpan={7}>
                                                        <Stack spacing={1}>
                                                            {row.players.split(",").map((p, i) => (
                                                                <Typography key={i} sx={{ color: "lightblue" }}>
                                                                    Player ID: {p}
                                                                </Typography>
                                                            ))}
                                                        </Stack>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </>
                                    );
                                })}
                            </TableBody>

                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>

            {/* Coin Ledger Modal */}
            <Dialog open={view === "coin"}
                onClose={() => setOpenCoin(false)}
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
                    Coin Ledger
                    <IconButton onClick={() => setOpenCoin(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <Close sx={{ color: "gold" }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers >
                    <TableContainer component={Paper} sx={tableStyles}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>SL</TableCell>
                                    <TableCell>Date & Time</TableCell>
                                    <TableCell>Item</TableCell>
                                    <TableCell>Coin</TableCell>
                                    <TableCell>Remaining Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coinData.map((row) => (
                                    <TableRow key={row.sl}>
                                        <TableCell>{row.sl}</TableCell>
                                        <TableCell>{row.date}</TableCell>
                                        <TableCell>{row.item}</TableCell>
                                        <TableCell sx={{ color: row.coin > 0 ? "lime" : "red" }}>
                                            {row.coin > 0 ? `+${row.coin}` : row.coin}
                                        </TableCell>
                                        <TableCell sx={{ color: "gold" }}>{row.balance}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog></>
    );
}

const coinData = [
    { sl: 1, date: "2025-09-20 10:00", item: "Daily Bonus", coin: +100, balance: 1200 },
    { sl: 2, date: "2025-09-20 14:30", item: "Game Entry", coin: -50, balance: 1150 },
    { sl: 3, date: "2025-09-22 19:45", item: "Game Reward", coin: +200, balance: 1350 },
];

const tableStyles = {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
    "& .MuiTableCell-root": {
        color: "white",
        borderColor: "#334155",
    },
    "& .MuiTableHead-root .MuiTableCell-root": {
        backgroundColor: "#1e293b",
        fontWeight: "bold",
        color: "#06b6d4",
    },
    "& .MuiTableRow-root:hover": {
        backgroundColor: "rgba(255, 215, 0, 0.1)",
    },
};
