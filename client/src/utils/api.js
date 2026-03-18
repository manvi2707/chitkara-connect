// =============================================
// client/src/utils/api.js — Updated for Phase 2
// =============================================

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Auto-attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("chitkaraToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ─────────────────────────────────────
export const studentRegister = (data) => API.post("/auth/student/register", data);
export const studentLogin    = (data) => API.post("/auth/student/login", data);
export const facultyRegister = (data) => API.post("/auth/faculty/register", data);
export const facultyLogin    = (data) => API.post("/auth/faculty/login", data);

// ── Faculty ──────────────────────────────────
export const getAllFaculty        = ()     => API.get("/faculty");
export const getFacultyById       = (id)   => API.get(`/faculty/${id}`);
export const updateFacultyProfile = (data) => API.put("/faculty/profile/update", data);

// ── Meetings ─────────────────────────────────
export const bookMeeting        = (data)     => API.post("/meetings/book", data);
export const getMyMeetings      = ()         => API.get("/meetings/my-meetings");
export const getFacultyMeetings = ()         => API.get("/meetings/faculty-meetings");
export const respondToMeeting   = (id, data) => API.put(`/meetings/${id}/respond`, data);

// ── Messages ─────────────────────────────────
export const sendMessage     = (data)     => API.post("/messages/send", data);
export const getInbox        = ()         => API.get("/messages/inbox");
export const replyToMessage  = (id, data) => API.post(`/messages/${id}/reply`, data);
export const markMessageRead = (id)       => API.put(`/messages/${id}/read`);

// ── Photo Upload (NEW) ───────────────────────
// Note: photo uploads use FormData not JSON
// The actual upload call is inside PhotoUpload.jsx using API directly
// These are just for convenience if needed elsewhere
export const deleteFacultyPhoto = () => API.delete("/upload/photo");

export default API;
