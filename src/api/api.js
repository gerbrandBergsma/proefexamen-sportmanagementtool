import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // basis-URL van je backend
  withCredentials: true, // belangrijk als je auth cookies gebruikt
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
