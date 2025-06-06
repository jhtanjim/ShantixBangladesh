import axios from "axios";
//https://shantix-corp.com/api
const instance = axios.create({
  baseURL: "https://shantix.onrender.com/",
});

instance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
