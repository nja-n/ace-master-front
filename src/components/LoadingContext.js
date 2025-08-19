import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();
export const useLoading = () => useContext(LoadingContext);

let externalSetLoading = null;
let externalSetLoadingMessage = null;

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading");

  return (
    <LoadingContext.Provider value={{ loading, setLoading, loadingMessage, setLoadingMessage }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const setGlobalLoading = (state, message = "Loading...") => {
  if (externalSetLoading) externalSetLoading(state);
  if (externalSetLoadingMessage && message) externalSetLoadingMessage(message);
};
