import { g } from "framer-motion/client";

export const apiClient = async (endpoint, {
  method = "GET",
  body = null,
  headers = {},
  withAuth = true,
  contentType = "application/json",
  credentials = "include", // can be 'same-origin', 'omit', or 'include'
} = {}) => {

  const defaultHeaders = {};

  if (contentType && contentType !== "multipart/form-data") {
    defaultHeaders["Content-Type"] = contentType;
  }

  // Add Authorization token if available
  if (withAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${endpoint}`, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
      credentials,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Request failed");
    }

    return response.json();

  } catch (error) {
    console.error("Error in apiClient:", error);
    throw error;
  } finally {
  }

};
