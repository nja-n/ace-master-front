import React, { useEffect, useRef } from "react";
import { Button } from "@mui/material";

const RewardedAd = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  /*useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const player = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto"
      });

      player.ima({
        id: "reward-video",
        adTagUrl:
          "https://i.l.inmobi.net/vast/v1/vast.xml?plid=10000485614&adtype=video"
      });

      playerRef.current = player;

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
          playerRef.current = null;
        }
      };
    }
  }, []);

  const handleShowAd = () => {
    if (playerRef.current) {
      playerRef.current.ima.changeAdTag(
        "https://i.l.inmobi.net/vast/v1/vast.xml?plid=10000485614&adtype=video"
      );
      playerRef.current.ima.requestAds();
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        width="640"
        height="360"
      ></video>

      <Button
        variant="contained"
        color="primary"
        onClick={handleShowAd}
        style={{ marginTop: "20px" }}
      >
        Show Ad
      </Button>
    </div>
  );*/
};

export default RewardedAd;
