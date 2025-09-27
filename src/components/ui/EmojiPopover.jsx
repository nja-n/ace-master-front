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

export const emojiSounds = {
  "😀": "/sounds/happy1.mp3",
  "😁": "/sounds/happy2.mp3",
  "😂": "/sounds/laugh1.mp3",
  "🤣": "/sounds/laugh2.mp3",
  "😃": "/sounds/happy3.mp3",
  "😄": "/sounds/happy4.mp3",
  "😅": "/sounds/nervous.mp3",
  "😆": "/sounds/laugh3.mp3",
  "😉": "/sounds/wink.mp3",
  "😊": "/sounds/smile.mp3",
  "😋": "/sounds/yum.mp3",
  "😎": "/sounds/cool.mp3",
  "😍": "/sounds/love.mp3",
  "😘": "/sounds/kiss.mp3",
  "😗": "/sounds/kiss2.mp3",
  "😙": "/sounds/kiss3.mp3",
  "😚": "/sounds/kiss4.mp3",
  "🙂": "/sounds/smile2.mp3",
  "🤗": "/sounds/hug.mp3",
  "🤩": "/sounds/starstruck.mp3",
  "🤔": "/sounds/think.mp3",
  "🤨": "/sounds/raisedEyebrow.mp3",
  "😐": "/sounds/neutral.mp3",
  "😑": "/sounds/unamused.mp3",
  "😶": "/sounds/speechless.mp3",
  "🙄": "/sounds/eyeRoll.mp3",
  "😏": "/sounds/sly.mp3",
  "😣": "/sounds/frustrated.mp3",
  "😥": "/sounds/sad.mp3",
  "😮": "/sounds/surprised.mp3",
  "🤐": "/sounds/sealed.mp3",
  "😯": "/sounds/gasp.mp3",
  "😪": "/sounds/sleepy.mp3",
  "😫": "/sounds/tired.mp3",
  "😴": "/sounds/snore.mp3",
  "😌": "/sounds/relieved.mp3",
  "🤓": "/sounds/nerd.mp3",
  "😛": "/sounds/tongue.mp3",
  "😜": "/sounds/winkTongue.mp3",
  "😝": "/sounds/silly.mp3",
  "🤤": "/sounds/drool.mp3",
  "😒": "/sounds/annoyed.mp3",
  "😓": "/sounds/sweat.mp3",
  "😔": "/sounds/sad2.mp3",
  "😕": "/sounds/confused.mp3",
  "🙃": "/sounds/upsideDown.mp3",
  "🤑": "/sounds/money.mp3",
  "😲": "/sounds/shock.mp3",
};


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
