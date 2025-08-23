import { useEffect, useState } from "react";

function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Detect already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setInstalled(true);
    }

    // Handle beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Handle appinstalled event
    window.addEventListener("appinstalled", () => {
      console.log("App installed successfully");
      setInstalled(true);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", () => {});
    };
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
    <>
      {!installed && deferredPrompt && (
        <button
          onClick={handleInstallClick}
          style={{ position: "fixed", bottom: 20, right: 20 }}
        >
          📲 Install App
        </button>
      )}
    </>
  );
}

export default InstallPrompt;
