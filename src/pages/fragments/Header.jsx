import { Refresh, Task } from "@mui/icons-material";
import { AppBar, Box, Collapse, IconButton, Paper, Toolbar, Typography, useMediaQuery } from "@mui/material";
import { CircleQuestionMark, HelpCircleIcon, HomeIcon, InfoIcon, PersonStandingIcon, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImageIcon from "../../components/ui/CustomImageIcon";
import AceMasterLogo from "../../components/ui/GameLogoHeader";
import { useUser } from "../../components/ui/UserContext";
import CoinWithText from "./CoinWithText";

export const Header = ({ game = false }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const menuItems = [
    { icon: <HomeIcon />, label: "Home", onClick: () => navigate("/") },
    { icon: <PersonStandingIcon />, label: "Profile", onClick: () => navigate("/profile") },
    { icon: <Task />, label: "Tasks", onClick: () => navigate("/tasks") },
    { icon: <InfoIcon />, label: "About", onClick: () => navigate("/about") },
    { icon: <HelpCircleIcon />, label: "FAQ", onClick: () => navigate("/faq") },
  ];

  const pathToLabel = {
    "/": "Home",
    "/profile": "Profile",
    "/tasks": "Tasks",
    "/about": "About",
    "/faq": "FAQ",
  };
  const activeTab = pathToLabel[location.pathname] || "Home";

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, rgba(30,41,59,0.55), rgba(51,65,85,0.55))",
        boxShadow: 3,
        borderRadius: 2,
        color: "gold",
      }}
    >
      <Toolbar sx={{
        display: "flex", justifyContent: "space-between",
        marginLeft: '8px', marginRight: '8px',
      }}>
        <IconButton
          edge="start"
          color="inherit"
        >
          <ImageIcon onclick={() => navigate(-1)} icon="back" />

        </IconButton>
        {/* Left side: Logo */}
        <AceMasterLogo />

        {/* Right side: Balance + Nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CoinWithText coinBalance={user && user.coinBalance} />
          {/* <ImageIcon onclick={() => navigate("/")} icon="home" /> */}
          {game ? (
            <>
              <Box display="flex" flexDirection="row">
                <IconButton color="inherit" onClick={() => alert("How to play in FAQ Session")}>{/**setJoyrideRef(1) */}
                  <CircleQuestionMark />
                </IconButton>
                <IconButton color="inherit" onClick={() => window.location.reload()}>
                  <Refresh />
                </IconButton>
              </Box>
              {/* <ImageIcon onclick={() => alert("Question Clicked")} icon="question" />
            <ImageIcon onclick={() => alert("Refresh Clicked")} icon="refresh" /> */}
            </>
          )
            : isMobile ? (
              <HamburgerArrow open={openMenu} onClick={() => setOpenMenu((prev) => !prev)} />
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {menuItems.map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      cursor: "pointer",
                      color: activeTab !== item.label ? "gold" : "lightgray",
                    }}
                    onClick={item.onClick}
                  >
                    {item.icon}
                    <Typography variant="caption">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            )}
        </Box>
      </Toolbar>
      {!game && isMobile && (
        <Collapse in={openMenu}>
          <Paper elevation={3}
            sx={{
              background: "linear-gradient(135deg, rgba(30,41,59,0.55), rgba(51,65,85,0.55))",
              color: "gold"
            }}>
            <Box sx={{ display: "flex", justifyContent: "space-around", py: 1 }}>
              {menuItems.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    color: activeTab !== item.label ? "gold" : "lightgray",
                  }}
                  onClick={() => {
                    item.onClick();
                    setOpenMenu(false);
                  }}
                >
                  {item.icon}
                  <Typography variant="caption">{item.label}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Collapse>
      )}
    </AppBar>
  )
}


const HamburgerArrow = ({ open, onClick }) => (
  <IconButton onClick={onClick} sx={{ width: 40, height: 40, position: "relative" }}>
    {/* Top bar */}
    <Box
      sx={{
        position: "absolute",
        width: 24,
        height: 2,
        backgroundColor: "gold",
        top: open ? "50%" : "30%",
        left: "50%",
        transform: `translate(-50%, -50%) rotate(${open ? "45deg" : "0deg"})`,
        transformOrigin: "center",
        transition: "all 0.3s ease",
      }}
    />
    {/* Middle bar */}
    <Box
      sx={{
        position: "absolute",
        width: 24,
        height: 2,
        backgroundColor: "gold",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scaleX(${open ? 0 : 1})`,
        transition: "all 0.3s ease",
      }}
    />
    {/* Bottom bar */}
    <Box
      sx={{
        position: "absolute",
        width: 24,
        height: 2,
        backgroundColor: "gold",
        top: open ? "50%" : "70%",
        left: "50%",
        transform: `translate(-50%, -50%) rotate(${open ? "-45deg" : "0deg"})`,
        transformOrigin: "center",
        transition: "all 0.3s ease",
      }}
    />
  </IconButton>
);

export default HamburgerArrow;