import { refreshAuth } from "../methods";
import { emit } from "./eventBus";

export const apiClient = async (endpoint, {
  method = "GET",
  body = null,
  headers = {},
  withAuth = true,
  contentType = "application/json",
  credentials = "include", // can be 'same-origin', 'omit', or 'include'
  refreshOnSuccess = false,
  keepalive = false,
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

  const doFetch = async () => {
    const fetchOptions = {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body:
        body instanceof FormData
          ? body
          : body instanceof URLSearchParams
            ? body.toString()
            : body
              ? JSON.stringify(body)
              : null,
      credentials,
    };

    if (keepalive) {
      fetchOptions.keepalive = true;
    }
    const response = await fetch(endpoint, fetchOptions);

    console.log("API response:", {
      endpoint,
      status: response.status,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const error = new Error(errorText || "Request failed");
      error.status = response.status;   // attach status
      throw error;
    }
    return response.json();
  }

  try {
    const result = await doFetch();
    if (refreshOnSuccess) {
      emit("user:refresh"); // 👈 notify UserProvider
    }
    return result;
  } catch (error) {
    console.error("API error:", error);
    if (error.status === 401 && withAuth) {
      // try refresh
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw error;

      try {
        const refreshResp = await fetch(refreshAuth, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResp.ok) throw new Error("Refresh failed");

        const data = await refreshResp.json();
        localStorage.setItem("accessToken", data.accessToken);

        // retry original request with new access token
        defaultHeaders["Authorization"] = `Bearer ${data.accessToken}`;
        return await doFetch();
      } catch (refreshError) {
        throw refreshError;
      }
    }
    throw error;
  }

};
