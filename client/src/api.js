import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ems_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ems_token");
      localStorage.removeItem("ems_user");
    }

    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ERR_NETWORK") return "Network error: unable to reach backend server";
  return fallback;
};

export const signup = async (payload) => {
  const res = await api.post("/auth/signup", payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);

  if (res.data?.token) {
    localStorage.setItem("ems_token", res.data.token);
  }

  return res.data;
};

export const fetchEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

export const fetchEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (payload) => {
  const res = await api.post("/events", payload);
  return res.data;
};

export const registerForEvent = async (eventId) => {
  const res = await api.post(`/events/${eventId}/register`);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("ems_token");
  localStorage.removeItem("ems_user");
};