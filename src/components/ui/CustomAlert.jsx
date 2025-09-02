// CustomAlertProvider.jsx
import React, { createContext, useContext, useState } from "react";
import { X } from "lucide-react";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const [alertData, setAlertData] = useState(null);

  const showAlert = (msg, { showOk = true } = {}) => {
    return new Promise((resolve) => {
      setAlertData({ type: "alert", message: msg, showOk, resolve });
    });
  };

  const showConfirm = (msg) => {
    return new Promise((resolve) => {
      setAlertData({ type: "confirm", message: msg, resolve });
    });
  }; 

  const closeAlert = (result = false) => {
    if (alertData?.resolve) {
      alertData.resolve(result);
    }
    setAlertData(null);
  };

  // 🔄 Override global alert + confirm
  window.alert = (msg) => showAlert(msg);
  window.confirm = (msg) => showConfirm(msg);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {alertData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div
            className="relative rounded-2xl shadow-xl w-80 p-6 animate-fadeIn"
            style={{
              background: "linear-gradient(135deg, #1e293b, #334155)",
              color: "#f1f5f9",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => closeAlert(false)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-xl font-bold text-center mb-4 text-white">
              {alertData.type === "confirm" ? "Confirm" : "Alert"}
            </h2>

            {/* Message */}
            <p className="text-center mb-6">{alertData.message}</p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              {alertData.type === "confirm" ? (
                <>
                  <button
                    onClick={() => closeAlert(true)}
                    className="px-6 py-2 rounded-xl font-semibold shadow 
                               transition bg-green-500 text-white hover:bg-green-400"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => closeAlert(false)}
                    className="px-6 py-2 rounded-xl font-semibold shadow 
                               transition bg-red-500 text-white hover:bg-red-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                alertData.showOk && (
                  <button
                    onClick={() => closeAlert(true)}
                    className="px-6 py-2 rounded-xl font-semibold shadow 
                               transition bg-yellow-500 text-black hover:bg-yellow-400"
                  >
                    OK
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
