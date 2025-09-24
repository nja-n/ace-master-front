import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const SCRIPT_SRC = "https://gizokraijaw.net/vignette.min.js"; // your Propeller tag URL

export default function InterstitialAd({ zone, load = "immediate", delay = 1000, enabled = true }) {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
  const clickListenerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    let timeoutId = null;

    const cleanupInjected = () => {
      if (scriptRef.current) {
        try { scriptRef.current.remove(); } catch (e) {}
        scriptRef.current = null;
      }
      if (containerRef.current) containerRef.current.innerHTML = "";
    };

    const inject = () => {
      // prevent double injection
      if (!containerRef.current || scriptRef.current) return;

      // clear any leftover inside container
      containerRef.current.innerHTML = "";

      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.setAttribute("data-zone", zone);
      s.setAttribute("data-cfasync", "false");
      // Append script into the container so the tag's nodes (iframes) are scoped
      containerRef.current.appendChild(s);
      scriptRef.current = s;
    };

    if (load === "immediate") {
      inject();
    } else if (load === "afterDelay") {
      timeoutId = window.setTimeout(inject, delay);
    } else if (load === "onAction") {
      // wait for first user interaction (click) anywhere on body
      const onBodyClick = () => {
        inject();
        document.body.removeEventListener("click", onBodyClick, true);
      };
      clickListenerRef.current = onBodyClick;
      document.body.addEventListener("click", onBodyClick, true);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (clickListenerRef.current) document.body.removeEventListener("click", clickListenerRef.current, true);
      cleanupInjected();
    };
  }, [zone, load, delay, enabled]);

  return <div ref={containerRef} aria-hidden style={{ minHeight: 0 }} />;
}

InterstitialAd.propTypes = {
  zone: PropTypes.string.isRequired, // your Propeller zone id (as string)
  load: PropTypes.oneOf(["immediate", "afterDelay", "onAction"]),
  delay: PropTypes.number,
  enabled: PropTypes.bool,
};
