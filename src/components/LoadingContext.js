import React, { createContext, useState, useContext, useEffect } from 'react';
import { on } from './utils/eventBus';

const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  useEffect(() => {
    const offEvent = on("loading:state", ({ state, message }) => {
      setLoading(state);
      setLoadingMessage(message || "Loading...");
    });
    return () => offEvent();
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, loadingMessage, setLoadingMessage }}>
      {children}
    </LoadingContext.Provider>
  );
};
