import axios from "axios";

// TODO: Deploy hone ke baad is URL ko apne deployed backend URL se replace kar dein
// Example: "https://your-app.onrender.com/api"
const api = axios.create({
  baseURL: "https://complain-system-red.vercel.app/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("scms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("scms_token");
      localStorage.removeItem("scms_user");
    }
    return Promise.reject(error);
  }
);

export default api;
