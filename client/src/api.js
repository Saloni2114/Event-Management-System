import axios from 'axios'

// Axios instance — base URL proxied to Express backend
const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token automatically to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ──────────────────────────────────────────────────
export const signup = (payload) =>
  client.post('/auth/signup', payload).then(r => r.data)

export const login = (payload) =>
  client.post('/auth/login', payload).then(r => r.data)

// ── Events ────────────────────────────────────────────────
export const fetchEvents = () =>
  client.get('/events').then(r => r.data)

export const fetchEventById = (id) =>
  client.get(`/events/${id}`).then(r => r.data)

export const createEvent = (payload) =>
  client.post('/events', payload).then(r => r.data)

// ── Registration ──────────────────────────────────────────
export const registerForEvent = (eventId) =>
  client.post(`/events/${eventId}/register`).then(r => r.data)
