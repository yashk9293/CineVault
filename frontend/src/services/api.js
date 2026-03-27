import axios from "axios";

const API = axios.create({
  baseURL: "https://cinevault-hek5.onrender.com",    // http://localhost:5000
});

// attach JWT automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;