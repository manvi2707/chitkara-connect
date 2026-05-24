// =============================================
// client/src/utils/api.js
// FIXED: Token refresh on 401, better error handling
// =============================================

import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ── Request interceptor: attach token ─────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chitkaraToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 globally ─
// FIX: When token expires (Render free tier restarts after 15 min idle),
// automatically clear storage and redirect to login instead of silent failure.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear and redirect
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes("/login");
      if (!isLoginPage) {
        localStorage.removeItem("chitkaraToken");
        localStorage.removeItem("chitkaraUser");
        localStorage.removeItem("chitkaraPhoto");
        // Redirect to appropriate login
        const savedUser = localStorage.getItem("chitkaraUser");
        const role = savedUser ? JSON.parse(savedUser)?.role : null;
        window.location.href = role === "faculty" ? "/login/faculty" : "/login/student";
      }
    }
    return Promise.reject(error);
  }
);

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
export const getConversations  = ()               => API.get("/messages/conversations");
export const getThreadMessages = (conversationId) => API.get(`/messages/conversations/${conversationId}/messages`);
export const openConversation  = (data)           => API.post("/messages/conversations/open", data);
export const sendMessage       = (data)           => API.post("/messages/send", data);

// ── Old API kept for backwards compat ────────
export const getInbox        = ()         => API.get("/messages/inbox");
export const replyToMessage  = (id, data) => API.post(`/messages/${id}/reply`, data);
export const markMessageRead = (id)       => API.put(`/messages/${id}/read`);

// ── Photo Upload ─────────────────────────────
export const deletePhoto = () => API.delete("/upload/photo");

// ── Account Deletion ─────────────────────────
export const deleteAccount = (data) => API.delete("/auth/delete-account", { data });

// ── Availability ─────────────────────────────
export const getAvailableSlots = (facultyId, date) =>
  API.get(`/availability/${facultyId}?date=${date}`);

// ── Student Profile ───────────────────────────
export const getStudentProfile    = ()     => API.get("/student/profile");
export const updateStudentProfile = (data) => API.put("/student/profile", data);

// ── Change Password ───────────────────────────
export const changePassword = (data) => API.put("/auth/change-password", data);

export default API;
