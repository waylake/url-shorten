import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createShortUrl = async (longUrl: string) => {
  const response = await apiClient.post("/url/shorten", { longUrl });
  return response.data;
};

export const getUserUrls = async () => {
  const response = await apiClient.get("/url/user/urls");
  return response.data;
};

export const getUrlStats = async (shortUrl: string) => {
  const response = await apiClient.get(`/url/stats/${shortUrl}`);
  return response.data;
};

export const getUrlData = async (shortUrl: string) => {
  const response = await apiClient.get(`/url/stats/${shortUrl}`);

  return response.data;
};
