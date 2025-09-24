import { useLocation } from "react-router-dom";
import InterstitialAd from "./InterstitialAd";

export default function AdGuardedInterstitial({ zone, ...props }) {
  const loc = useLocation();
  // exclude home and any /play route
  if (loc.pathname === "/" || loc.pathname.startsWith("/play")) return null;
  return <InterstitialAd zone={zone} {...props} />;
}
