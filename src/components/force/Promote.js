import { useEffect, useState } from "react";

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted A2HS");
      } else {
        console.log("User dismissed A2HS");
      }
      setDeferredPrompt(null);
    });
  };

  return (
    deferredPrompt && (
      <button onClick={handleInstallClick} style={{ position: "fixed", bottom: 20, right: 20 }}>
        📲 Install App
      </button>
    )
  );
}

export default InstallPrompt;
