import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Include cookies in requests
  // No default Content-Type header; set per request or let axios handle it
});

// Request interceptor: add token and future logic
API.interceptors.request.use(
  (config) => {
    // Read token from cookies
    const getCookie = (name: string) => {
      return Cookies.get(name) || null;
    };
    const token = getCookie("token");
    console.log("Request Interceptor: Adding token to headers", { token });
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Add more request middleware logic here in future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: handle responses and errors
API.interceptors.response.use(
  (response) => {
    // Add response middleware logic here in future
    return response;
  },
  (error) => {
    // Example: handle token expiration or global errors
    if (error.response && error.response.status === 401) {
      // Optionally, handle unauthorized access (e.g., redirect to login)
      // window.location.href = '/login';
    }
    // Add more error middleware logic here in future
    return Promise.reject(error);
  },
);

export default API;
