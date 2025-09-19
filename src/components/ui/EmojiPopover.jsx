import React from "react";
import { Popover, Box, IconButton } from "@mui/material";

const commonEmojis = [
  "😀","😁","😂","🤣","😃","😄","😅","😆",
  "😉","😊","😋","😎","😍","😘","😗","😙",
  "😚","🙂","🤗","🤩","🤔","🤨","😐","😑",
  "😶","🙄","😏","😣","😥","😮","🤐","😯",
  "😪","😫","😴","😌","🤓","😛","😜","😝",
  "🤤","😒","😓","😔","😕","🙃","🤑","😲"
]; // 48 emojis

export default function EmojiPopover({
  anchorPopoverEl,
  handlePopoverClose,
  onEmojiSelect,
}) {
  return (
    <Popover
      open={Boolean(anchorPopoverEl)}
      anchorEl={anchorPopoverEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      PaperProps={{
        sx: {
          backgroundColor: "#0f3d0f", // dark green theme
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <Box
        display="grid"
        gridTemplateColumns="repeat(6, 1fr)" // 6 per row
        gridTemplateRows="repeat(8, 1fr)"  // 8 rows
        gap={0.5}
      >
        {commonEmojis.map((emoji, i) => (
          <IconButton
            key={i}
            onClick={() => {
              onEmojiSelect(emoji);
              handlePopoverClose();
            }}
            sx={{
              fontSize: 24,
              width: 40,
              height: 40,
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            {emoji}
          </IconButton>
        ))}
      </Box>
    </Popover>
  );
}
