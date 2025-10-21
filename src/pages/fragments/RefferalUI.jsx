import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ShareIcon from "@mui/icons-material/Share";
import QrCodeIcon from "@mui/icons-material/QrCode";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import { CheckCircle2Icon, CheckCircleIcon, FacebookIcon, InstagramIcon } from "lucide-react";
import { apiClient } from "../../components/utils/ApIClient";
import { useLoading } from "../../components/LoadingContext";
import { fetchReferalTasks } from "../../components/methods";
import { ChatBubble, CheckSharp } from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";

const ReferralUI = ({ code }) => {
  const { setLoading } = useLoading();
  const [task, setTask] = useState({});

  const referralLink = "https://playacemaster.online/invite/" + code;
  const referralCode = code;

  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    setLoading(true);

    const loadRefTask = async () => {
      try {
        const response = await apiClient(fetchReferalTasks);
        setTask(response);
      } catch (error) {
        console.error("Error loading daily tasks:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRefTask();
  }, []);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const encodedText = encodeURIComponent(
    `Join with Ace Master card game. You can Earn Referral Bonus! ${referralLink}`
  );
  const handleMore = async () => {
    const shareData = {
      title: "Play Ace Master Online",
      text: "Join with Ace Master card game. You can Earn Referral Bonus!",
      url: referralLink, // ✅ must be full https:// link
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully");
      } catch (err) {
        console.warn("Share canceled or failed:", err);
      }
    } else {
      // 💡 Fallback for desktop browsers
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert("Link copied! You can paste it anywhere to share.");
      } catch (err) {
        console.error("Failed to copy link:", err);
        alert("Your browser doesn't support sharing or clipboard copy.");
      }
    }
  };


  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="#fff">
        🎁 Invite Friends & Earn Rewards
      </Typography>

      {/* Referral Card */}
      <Card sx={{ mb: 3, p: 0, borderRadius: 3, boxShadow: 4 }}>
        <CardContent >
          <Typography variant="subtitle1">Your Referral Link</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              mt: 1,
              bgcolor: "grey.100",
              borderRadius: 2,
              p: 1, // optional padding
              minWidth: 0, // 🔥 crucial for text truncation inside flex
            }}
          >
            <Typography
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flexGrow: 1,
                minWidth: 0, // 🔥 allows ellipsis to work properly in flex
                mr: 1, // space before the icon
                width: '10px'
              }}
            >
              {referralLink}
            </Typography>

            <Tooltip title={copiedIndex === 1 ? "Copied!" : "Copy"}>
              <IconButton onClick={() => handleCopy(referralLink, 1)} color="inherit">
                <AnimatePresence mode="wait">
                  {copiedIndex === 1 ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckSharp color="success" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContentCopyIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </IconButton>
            </Tooltip>
          </Box>


          <Typography sx={{ mt: 2 }}>Referral Code: </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1, bgcolor: "grey.100", borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ width: '10px' }}>{referralCode}</Typography>

            <Tooltip title={copiedIndex === 2 ? "Copied!" : "Copy"}>
              <IconButton onClick={() => handleCopy(referralCode, 2)} color="inherit">
                <AnimatePresence mode="wait">
                  {copiedIndex === 2 ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckSharp color="success" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContentCopyIcon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Share Buttons */}
          <Box
            display="flex"
            flexWrap="wrap"
            gap={1}
            mt={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<WhatsAppIcon />}
              onClick={() =>
                window.open(`https://wa.me/?text=${encodedText}`, "_blank")
              }
              sx={{ flex: "1 1 120px" }}
            >
              WhatsApp
            </Button>

            <Button
              variant="contained"
              color="info"
              startIcon={<TelegramIcon />}
              onClick={() =>
                window.open(
                  `https://t.me/share/url?url=${referralLink}&text=${encodedText}`,
                  "_blank"
                )
              }
              sx={{ flex: "1 1 120px" }}
            >
              Telegram
            </Button>

            <Button
              variant="contained"
              color="secondary"
              startIcon={<InstagramIcon />}
              onClick={() => {
                handleCopy(encodedText)
                window.open(
                  `https://www.instagram.com/?url=${referralLink}`,
                  "_blank"
                )
              }
              }
              sx={{ flex: "1 1 120px" }}
            >
              Instagram
            </Button>

            <Button
              variant="contained"
              color="primary"
              startIcon={<FacebookIcon />}
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${referralLink}`,
                  "_blank"
                )
              }
              sx={{ flex: "1 1 120px" }}
            >
              Facebook
            </Button>

            <Button
              variant="contained"
              color="warning"
              startIcon={<ChatBubble />}
              onClick={() =>
                window.open(
                  `https://www.snapchat.com/scan?attachmentUrl=${referralLink}`,
                  "_blank"
                )
              }
              sx={{ flex: "1 1 120px" }}
            >
              Snapchat
            </Button>

            <Button
              onClick={handleMore}
              variant="outlined"
              startIcon={<ShareIcon />}
              sx={{ flex: "1 1 120px" }}
            >
              More
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Rewards Progress */}
      {/* <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Progress towards next reward
          </Typography>
          <LinearProgress
            variant="determinate"
            value={40}
            sx={{ height: 10, borderRadius: 5 }}
          />
          <Typography variant="body2" mt={1}>
            4/10 friends invited 🎉
          </Typography>
        </CardContent>
      </Card> */}

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Friends Invited", value: task.countRef },
          { label: "Rewards Earned", value: task.coinsEarned?.split(".")[0] + " Coins" },
          { label: "Total Friends", value: task.countFriends },
          { label: "Collected Badges", value: "0" },
        ].map((stat, idx) => (
          <Grid item xs={6} sm={3} key={idx}>
            <Card sx={{ borderRadius: 3, textAlign: "center", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Invite List */}
      {/* <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="subtitle1">Recent Invites</Typography>
          <Divider sx={{ my: 1 }} />
          <List>
            {[
              { name: "Alice", status: "Joined" },
              { name: "Bob", status: "Pending" },
              { name: "Charlie", status: "Playing 🎮" },
            ].map((friend, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={friend.name}
                  secondary={friend.status}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card> */}
    </Box>
  );
};

export default ReferralUI;
