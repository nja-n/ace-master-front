import {
    Box,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import AdBanner from "../components/adsterBanner";
import { apiClient } from "../components/utils/ApIClient";
import { useLoading } from "../components/LoadingContext";
import { fetchDailyTasks } from '../components/methods';
import { useUser } from "../components/ui/UserContext";
import DailyTaskBox from "./fragments/DailyTaskBox";
import ReferralUI from "./fragments/RefferalUI";

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
            <AdBanner />
            <DailyTaskBox tasks={dailyTask} updateBalance={updateBalance} />
            {/* <ReferralUI coinBalance={user?.coinBalance} /> */}
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