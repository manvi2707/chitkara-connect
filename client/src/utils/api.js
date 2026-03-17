import axios from "axios";

// Base URL of your backend server
// During development: proxy in package.json handles this
// After deployment: reads from .env file
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ── Auto-attach JWT token to every request ───
// This runs BEFORE every single API call automatically
// So you never have to manually add the token in each component
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("chitkaraToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =============================================
// AUTH API CALLS
// =============================================

export const studentRegister = (data) => API.post("/auth/student/register", data);
export const studentLogin    = (data) => API.post("/auth/student/login", data);
export const facultyRegister = (data) => API.post("/auth/faculty/register", data);
export const facultyLogin    = (data) => API.post("/auth/faculty/login", data);

// =============================================
// FACULTY API CALLS
// =============================================

export const getAllFaculty        = ()     => API.get("/faculty");
export const getFacultyById       = (id)   => API.get(`/faculty/${id}`);
export const updateFacultyProfile = (data) => API.put("/faculty/profile/update", data);

// =============================================
// MEETING API CALLS
// =============================================

export const bookMeeting       = (data) => API.post("/meetings/book", data);
export const getMyMeetings     = ()     => API.get("/meetings/my-meetings");
export const getFacultyMeetings= ()     => API.get("/meetings/faculty-meetings");
export const respondToMeeting  = (id, data) => API.put(`/meetings/${id}/respond`, data);

// =============================================
// MESSAGE API CALLS
// =============================================

export const sendMessage    = (data)     => API.post("/messages/send", data);
export const getInbox       = ()         => API.get("/messages/inbox");
export const replyToMessage = (id, data) => API.post(`/messages/${id}/reply`, data);
export const markMessageRead= (id)       => API.put(`/messages/${id}/read`);

export default API;