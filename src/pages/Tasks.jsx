import {
    Box,
    Typography
} from "@mui/material";
import { useUser } from "../components/ui/UserContext";
import DailyTaskBox from "./fragments/DailyTaskBox";
import RefferalUI from "./fragments/RefferalUI";

const Tasks = () => {
    const { user, setUser } = useUser();

    return (
        <Box
            sx={{ mx: "auto", mt: 5, px: 3 }}
        >
            <DailyTaskBox />
            {/* <RefferalUI code={user?.referralCode} /> */}
            <Box
                sx={{
                    mt: 5,
                    py: 3,
                    textAlign: "center",
                    border: "2px dashed #ccc",
                    borderRadius: 2
                }}
            >
                {/* <RewardedAd/> */}
                <Typography variant="h6" color="grey">
                    🔒 More tasks will be updated later
                </Typography>
            </Box>
        </Box>
    );
};

export default Tasks;