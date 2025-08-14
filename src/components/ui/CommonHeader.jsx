import { ArrowBack } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, Typography, Box } from "@mui/material";
import AceMasterLogo from "./GameLogoHeader";
import { useNavigate } from "react-router-dom";
import CoinIcon from '../../images/aeither_coin.png';

const CommonHeader = ({ coinBalance }) => {
    const navigate = useNavigate();
    return (
        <AppBar position="static" sx={{ backgroundColor: "#000000", border: "2px solid #FFD700", boxShadow: "0 0 10px #FFD700", borderRadius: "12px", mb: 3 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Back Button */}
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => navigate(-1)}
                >
                    <ArrowBack />
                </IconButton>

                <AceMasterLogo />

                {/* Empty space for alignment */}
                {/* <Box sx={{ flexGrow: 1 }} /> */}
                {coinBalance && <Typography variant="h6" sx={{ fontWeight: "bold", width: 'max-content', display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '8px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'right' }}>
                        <img src={CoinIcon} alt="Coin" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                    </Box>
                    <Typography component="span" sx={{ fontWeight: "bold", color: "#ff9800" }}>{coinBalance}</Typography>
                </Typography>
                }

                {/* Social Media Icons */}

            </Toolbar>
        </AppBar>
    );
};

export default CommonHeader;