import React, { useState } from "react";
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
import { FacebookIcon, InstagramIcon } from "lucide-react";

const ReferralUI = ({code}) => {
  const [copied, setCopied] = useState(false);

  const referralLink = "https://playacemaster.online/invite/" + code;
  const referralCode = code;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const encodedText = encodeURIComponent(
    `Join me in Ace Master card game! ${referralLink}`
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="#fff">
        🎁 Invite Friends & Earn Rewards
      </Typography>

      {/* Referral Card */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="subtitle1">Your Referral Link</Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1, p: 1.5, bgcolor: "grey.100", borderRadius: 2 }}
          >
            <Typography variant="body2" noWrap>
              {referralLink}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy"}>
              <IconButton onClick={() => handleCopy(referralLink)}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography sx={{ mt: 2 }}>Referral Code: </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 1, p: 1.5, bgcolor: "grey.100", borderRadius: 2 }}
          >
            <Typography variant="h6">{referralCode}</Typography>
            <Tooltip title={copied ? "Copied!" : "Copy"}>
              <IconButton onClick={() => handleCopy(referralCode)}>
                <ContentCopyIcon />
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
              onClick={() =>
                window.open(
                  `https://www.instagram.com/?url=${referralLink}`,
                  "_blank"
                )
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

            {/* <Button
              variant="contained"
              color="warning"
              startIcon={<SnapchatIcon />}
              onClick={() =>
                window.open(
                  `https://www.snapchat.com/scan?attachmentUrl=${referralLink}`,
                  "_blank"
                )
              }
              sx={{ flex: "1 1 120px" }}
            >
              Snapchat
            </Button> */}

            <Button
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
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 4 }}>
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
      </Card>

      {/* Stats */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: "Friends Invited", value: 12 },
          { label: "Currently Playing", value: 5 },
          { label: "Rewards Earned", value: "500 Coins" },
          { label: "Tier", value: "Silver" },
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
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
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
      </Card>
    </Box>
  );
};

export default ReferralUI;
