// =============================================
// client/src/utils/api.js — Updated
// =============================================

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("chitkaraToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
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

// ── Messages — NEW conversation-based API ────
// Get all conversation threads for sidebar
export const getConversations = () => API.get("/messages/conversations");

// Get all messages inside a thread
export const getThreadMessages = (conversationId) =>
  API.get(`/messages/conversations/${conversationId}/messages`);

// Open or create a conversation with someone
export const openConversation = (data) => API.post("/messages/conversations/open", data);

// Send a message (REST — socket handles real-time delivery)
export const sendMessage = (data) => API.post("/messages/send", data);

// ── Old API kept for backwards compat ────────
export const getInbox        = ()         => API.get("/messages/inbox");
export const replyToMessage  = (id, data) => API.post(`/messages/${id}/reply`, data);
export const markMessageRead = (id)       => API.put(`/messages/${id}/read`);

// ── Photo Upload ─────────────────────────────
// ── Account Deletion ─────────────────────────
export const deleteAccount = (data) => API.delete("/auth/delete-account", { data });

// ── Photo Upload ─────────────────────────────
export const deletePhoto = () => API.delete("/upload/photo");

// ── Availability ─────────────────────────────
export const getAvailableSlots = (facultyId, date) =>
  API.get(`/availability/${facultyId}?date=${date}`);

// ── Student Profile ───────────────────────────
export const getStudentProfile    = ()     => API.get("/student/profile");
export const updateStudentProfile = (data) => API.put("/student/profile", data);

// ── Change Password ───────────────────────────
export const changePassword = (data) => API.put("/auth/change-password", data);
export default API;