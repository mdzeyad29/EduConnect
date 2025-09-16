import axios from "axios"

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4000", // backend URL
  withCredentials: true,            // <--- important!
});

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