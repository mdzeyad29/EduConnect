import axios from "axios"
import { toast } from "react-hot-toast"

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // backend URL
  withCredentials: true,            // <--- important!
});

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the response
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      const errorMessage = error.response.data?.message || "Your session has expired. Please login again.";
      const isExpired = error.response.data?.expired;
      
      // Clear token and user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Clear cart data
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
      
      // Show toast notification
      if (isExpired) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Authentication failed. Please login again.");
      }
      
      // Redirect to login page
      // Using window.location to ensure a full page reload and clear all state
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
    }
    
    // Return the error so it can be handled by the calling code
    return Promise.reject(error);
  }
);

export const apiConnector = (method, url, bodyData = null, headers = {}, params = {}) => {
    const config = {
        method: method,
        url: url,
        headers: headers,
        params: params,
    };

    // Only include data if it's not null and method allows it
    if (bodyData && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
        config.data = bodyData;
    }

    return axiosInstance(config);
}