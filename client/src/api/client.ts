// src/api/client.ts
import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const API_BASE = "http://localhost:5500/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization header from Zustand (sync access)
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
