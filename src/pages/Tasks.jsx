import {
    Box,
    Typography
} from "@mui/material";
import AdBanner from "../components/adsterBanner";
import { useUser } from "../components/ui/UserContext";
import DailyTaskBox from "./fragments/DailyTaskBox";

const Tasks = () => {
    const { user, setUser } = useUser();

    

    /*const updateBalance = async (coin) => {
        if (!user) return;
        setUser(prev => ({
            ...prev,
            coinBalance: prev.coinBalance + coin,
        }));
    }
*/
    return (
        <Box
            sx={{ mx: "auto", mt: 5, px: 3 }}
        >
            <AdBanner />
            <DailyTaskBox />
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