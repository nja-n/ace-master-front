import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname.startsWith("/play")) {
      return;
    }

    // Inject PropellerAds script
    const script = document.createElement("script");
    script.src = "https://fpyf8.com/88/tag.min.js";
    script.setAttribute("data-zone", "173003");
    script.setAttribute("async", "true");
    script.setAttribute("data-cfasync", "false");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [location]);

  return null; // This component doesn’t render UI
};

export default AdManager;
