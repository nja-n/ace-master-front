import { Close, KeyboardArrowDown } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { fetchCoinLedger, fetchGameLedger } from "../../components/methods";
import { apiClient } from "../../components/utils/ApIClient";
import { formatDate } from "../../components/Utiliy";

export const LedgerDialog = ({ view, setOpenCoin, setOpenGame, user }) => {
    const [gameHistory, setGameHistory] = useState([]);
    const [coinHistory, setCoinHistory] = useState([]);
    const [openRow, setOpenRow] = useState(-1);

    useEffect(() => {
        async function fetchProfile() {
            if (view === "game") {
                try {
                    const response = await apiClient(fetchGameLedger, {});
                    setGameHistory(response);
                    console.log(response);
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }
            } else {
                try {
                    const response = await apiClient(fetchCoinLedger, {});
                    setCoinHistory(response);
                    console.log(response);
                } catch (error) {
                    console.error("Error fetching profile:", error);
                }

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

                                    const usedCoins = row.totalPrizeAmount / row.players.split(",").length;
                                    const winningOrder = row.winningOrder?.split(",");

                                    let rank = null;
                                    let winningCoin = null;

                                    if (winningOrder) {
                                        const index = winningOrder.findIndex(entry => entry.split("-")[0] === String(user));
                                        if (index !== -1) {
                                            rank = index + 1; // rank is index + 1
                                            winningCoin = winningOrder[index].split("-")[1]; // coin part
                                        }
                                    }

                                    return (
                                        <>
                                            <TableRow key={row.id}>
                                                <TableCell>{row.sessionId.slice(0, 6)}...</TableCell>
                                                <TableCell>{row.roomId ? "Room" : "Classic"}</TableCell>
                                                <TableCell>{row.startedOn ? formatDate(row.startedOn, true) : "-"}</TableCell>
                                                <TableCell>{usedCoins ?? 0}</TableCell>
                                                <TableCell sx={{ color: "gold" }}>{winningCoin ?? 0}</TableCell>
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
                                                            {row.playerList?.map((p, i) => (
                                                                <Typography key={i} sx={{ color: "lightblue" }}>
                                                                    Player Name: {p.firstName},{" "}
                                                                    Rank:{" "}
                                                                    {winningOrder
                                                                        ? winningOrder.findIndex(entry => entry.split("-")[0] === String(p.id)) + 1
                                                                        : "--"}
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
                                    <TableCell sx={{ textAlign: "center" }}>Remaining Balance</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {coinHistory.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{formatDate(row.transactionDate, true)}</TableCell>
                                        <TableCell>{row.transactionType}</TableCell>
                                        <TableCell sx={{ color: row.creditAmount > 0 ? "lime" : "red" }}>
                                            {row.creditAmount > 0 ? `+${row.creditAmount}` : row.debitAmount}
                                        </TableCell>
                                        <TableCell sx={{ color: "gold", textAlign: "center" }}>{row.currentBalance}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog></>
    );
}

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
