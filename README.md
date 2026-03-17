<div align="center">

# 🎓 ChitkaraConnect

### A Faculty-Student Portal for Chitkara University

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

_Bridging the gap between students and faculty — one click at a time._

[🌐 Live Demo](#) · [🐛 Report Bug](https://github.com/yourusername/chitkara-connect/issues) · [✨ Request Feature](https://github.com/yourusername/chitkara-connect/issues)

---

![ChitkaraConnect Banner](https://via.placeholder.com/800x300/1e3a8a/ffffff?text=ChitkaraConnect+%F0%9F%8E%93)

</div>

---

## 📌 About The Project

**ChitkaraConnect** is a full-stack web application built as a
final-year B.E. CSE project for Chitkara University.

It solves a real problem that every student faces — _not knowing
which faculty to approach, how to contact them, or when they are
available._ This portal gives every student and faculty member a
dedicated digital space to connect professionally.

### 🎯 The Problem It Solves

| Problem                                        | Solution                                 |
| ---------------------------------------------- | ---------------------------------------- |
| Students don't know which faculty handles what | Faculty Directory with expertise tags    |
| No easy way to book meetings                   | Built-in meeting booking with time slots |
| Students email faculty on personal emails      | In-portal messaging system               |
| Faculty availability is unknown                | Faculty can toggle availability on/off   |
| Campus info is scattered everywhere            | Single Campus Info page with map         |

---

## ✨ Features

### 👨‍🎓 For Students

- 🔐 **Secure Registration & Login** — dedicated student portal
- 👨‍🏫 **Faculty Directory** — browse all faculty with search and filters
- 📅 **Book Meetings** — request specific time slots with any professor
- ✉️ **Messaging** — send messages and receive replies in-portal
- 🗺️ **Campus Info** — map, departments, contacts and useful links
- 📊 **Meeting Tracker** — track all your pending/accepted/rejected requests

### 👨‍🏫 For Faculty

- 🔐 **Separate Faculty Portal** — independent login and registration
- 👤 **Profile Management** — update bio, expertise, office, visiting hours
- 📅 **Meeting Control** — accept or reject requests with optional notes
- ✉️ **Inbox & Replies** — view student messages and reply directly
- 🟢 **Availability Toggle** — turn off meetings when busy

---

## 🏗️ Project Structure

```
chitkara-connect/
│
├── 📁 client/                      ← React.js Frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── 📁 pages/               ← Full page components
│       │   ├── LoginStudent.jsx
│       │   ├── LoginFaculty.jsx
│       │   ├── StudentDashboard.jsx
│       │   ├── FacultyDashboard.jsx
│       │   ├── FacultyDirectory.jsx
│       │   ├── FacultyProfileEdit.jsx
│       │   ├── Meetings.jsx
│       │   ├── Messages.jsx
│       │   └── CollegeMap.jsx
│       ├── 📁 components/          ← Reusable UI pieces
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── FacultyCard.jsx
│       │   ├── BookMeetingModal.jsx
│       │   ├── MeetingCard.jsx
│       │   ├── MessageCard.jsx
│       │   └── ProtectedRoute.jsx
│       ├── 📁 context/             ← Global auth state
│       │   └── AuthContext.jsx
│       ├── 📁 utils/               ← API call functions
│       │   └── api.js
│       ├── App.jsx                 ← Routes & navigation
│       └── index.js                ← React entry point
│
└── 📁 server/                      ← Node.js + Express Backend
    ├── 📁 models/                  ← MongoDB schemas
    │   ├── Student.js
    │   ├── Faculty.js
    │   ├── Meeting.js
    │   └── Message.js
    ├── 📁 routes/                  ← API endpoints
    │   ├── authRoutes.js
    │   ├── facultyRoutes.js
    │   ├── meetingRoutes.js
    │   └── messageRoutes.js
    ├── 📁 controllers/             ← Business logic
    │   ├── authController.js
    │   ├── facultyController.js
    │   ├── meetingController.js
    │   └── messageController.js
    ├── 📁 middleware/              ← JWT auth guard
    │   └── authMiddleware.js
    └── server.js                   ← Express entry point
```

---

## 🛠️ Tech Stack

### Frontend

| Technology                                  | Version | Purpose                      |
| ------------------------------------------- | ------- | ---------------------------- |
| [React.js](https://reactjs.org/)            | 18.2    | Component-based UI framework |
| [React Router v6](https://reactrouter.com/) | 6.21    | Client-side page routing     |
| [Tailwind CSS](https://tailwindcss.com/)    | 3.3     | Utility-first CSS styling    |
| [Axios](https://axios-http.com/)            | 1.6     | HTTP requests to backend     |

### Backend

| Technology                                       | Version | Purpose                 |
| ------------------------------------------------ | ------- | ----------------------- |
| [Node.js](https://nodejs.org/)                   | 18+     | JavaScript runtime      |
| [Express.js](https://expressjs.com/)             | 4.18    | Web server framework    |
| [MongoDB Atlas](https://mongodb.com/)            | Cloud   | Database                |
| [Mongoose](https://mongoosejs.com/)              | 8.0     | MongoDB object modeling |
| [JWT](https://jwt.io/)                           | 9.0     | Authentication tokens   |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 2.4     | Password hashing        |
| [Nodemailer](https://nodemailer.com/)            | 6.9     | Email notifications     |

---

## 🚀 Getting Started

### Prerequisites

Make sure these are installed on your computer:

```bash
node --version    # Should show v18 or higher
npm --version     # Should show v8 or higher
git --version     # Any version is fine
```

Download links:

- [Node.js](https://nodejs.org/) — download LTS version
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/) — recommended editor

---

### ⚙️ Installation & Setup

**Step 1 — Clone the repository**

```bash
git clone https://github.com/yourusername/chitkara-connect.git
cd chitkara-connect
```

**Step 2 — Set up MongoDB Atlas (free)**

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free account
2. Create a new project → Build a Database → choose **Free tier**
3. Create a database user (save the username and password)
4. Click **Connect** → **Drivers** → copy the connection string
5. It looks like: `mongodb+srv://username:password@cluster0.mongodb.net/`

**Step 3 — Configure backend environment**

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.mongodb.net/chitkara-connect
JWT_SECRET=chitkara_super_secret_key_change_this
PORT=5000
CLIENT_URL=http://localhost:3000
```

**Step 4 — Install backend packages**

```bash
cd server
npm install
```

**Step 5 — Install frontend packages**

```bash
cd ../client
npm install
```

**Step 6 — Run the backend server**

```bash
cd server
npm run dev
```

You should see:

```
✅ Connected to MongoDB successfully
🚀 Server is running on http://localhost:5000
```

**Step 7 — Run the frontend (new terminal)**

```bash
cd client
npm start
```

**Step 8 — Open your browser**

```
http://localhost:3000
```

🎉 ChitkaraConnect is now running!

---

## 🔗 API Reference

### Authentication

| Method | Endpoint                     | Body                                    | Description      |
| ------ | ---------------------------- | --------------------------------------- | ---------------- |
| `POST` | `/api/auth/student/register` | name, email, password, department, year | Register student |
| `POST` | `/api/auth/student/login`    | email, password                         | Student login    |
| `POST` | `/api/auth/faculty/register` | name, email, password, department       | Register faculty |
| `POST` | `/api/auth/faculty/login`    | email, password                         | Faculty login    |

### Faculty

| Method | Endpoint                      | Auth        | Description        |
| ------ | ----------------------------- | ----------- | ------------------ |
| `GET`  | `/api/faculty`                | Public      | Get all faculty    |
| `GET`  | `/api/faculty/:id`            | Public      | Get faculty by ID  |
| `PUT`  | `/api/faculty/profile/update` | Faculty JWT | Update own profile |

### Meetings

| Method | Endpoint                         | Auth        | Description            |
| ------ | -------------------------------- | ----------- | ---------------------- |
| `POST` | `/api/meetings/book`             | Student JWT | Book a meeting         |
| `GET`  | `/api/meetings/my-meetings`      | Student JWT | View own requests      |
| `GET`  | `/api/meetings/faculty-meetings` | Faculty JWT | View received requests |
| `PUT`  | `/api/meetings/:id/respond`      | Faculty JWT | Accept or reject       |

### Messages

| Method | Endpoint                  | Auth | Description      |
| ------ | ------------------------- | ---- | ---------------- |
| `POST` | `/api/messages/send`      | JWT  | Send a message   |
| `GET`  | `/api/messages/inbox`     | JWT  | View inbox       |
| `POST` | `/api/messages/:id/reply` | JWT  | Reply to message |
| `PUT`  | `/api/messages/:id/read`  | JWT  | Mark as read     |

---

## ☁️ Deployment Guide

### Deploy Backend → Render.com (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repository
4. Set these settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables (same as your `.env` file)
6. Click **Deploy** → copy your live URL

### Deploy Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Set **Root Directory** to `client`
4. Add environment variable:

```
   REACT_APP_API_URL = https://your-render-url.onrender.com/api
```

5. Click **Deploy** → your site is live!

---

## 🧪 Testing the Project

### Manual Test Checklist

**Authentication:**

- [ ] Student can register with valid details
- [ ] Student cannot register with duplicate email
- [ ] Student can log in with correct credentials
- [ ] Student cannot log in with wrong password
- [ ] Faculty can register and log in separately
- [ ] Logout clears session and redirects to home

**Faculty Directory:**

- [ ] All faculty cards load on the page
- [ ] Search by name works correctly
- [ ] Search by expertise works correctly
- [ ] Department filter works correctly
- [ ] Unavailable faculty don't show Book button

**Meeting Booking:**

- [ ] Student can book a meeting with available faculty
- [ ] Student can see their meetings with correct status
- [ ] Faculty can see all meeting requests
- [ ] Faculty can accept a meeting with a note
- [ ] Faculty can reject a meeting with a reason
- [ ] Status updates reflect immediately

**Messaging:**

- [ ] Student can compose and send a message to faculty
- [ ] Faculty receives the message in inbox
- [ ] Faculty can reply to the message
- [ ] Student receives the reply in inbox
- [ ] Unread messages show blue dot indicator
- [ ] Opening a message marks it as read

---

## 🗓️ Development Phases

- [x] **Phase 1** — Project setup, folder structure, config files
- [x] **Phase 2** — Database models (Student, Faculty, Meeting, Message)
- [x] **Phase 3** — Backend API (auth, faculty, meetings, messages)
- [x] **Phase 4** — Frontend auth pages (login + register)
- [x] **Phase 5** — Student dashboard (directory, meetings, messages)
- [x] **Phase 6** — Faculty dashboard (profile, meetings, messages)
- [x] **Phase 7** — Campus Info page with map
- [ ] **Phase 8** — Testing and bug fixes
- [ ] **Phase 9** — Deployment to Render + Vercel

---

## 🤝 Contributing

This is a university final year project. Contributions, suggestions,
and feedback are welcome!

1. Fork the Project
2. Create your Feature Branch

```bash
   git checkout -b feature/AmazingFeature
```

3. Commit your Changes

```bash
   git commit -m "✨ feat: Add amazing feature"
```

4. Push to the Branch

```bash
   git push origin feature/AmazingFeature
```

5. Open a Pull Request on GitHub

---

## 📄 License

Distributed under the MIT License.

```
MIT License — free to use, modify, and distribute
with attribution to the original author.
```

---

## 👨‍💻 Author

**Manvi**

- 🎓 B.E. Computer Science & Engineering
- 🏫 Chitkara University, Punjab
- 📅 Final Project
- 💻 GitHub: [@manvi2707](https://github.com/manvi2707)
- 📧 Email: manvigarg2707@gmail.com

---

## 🙏 Acknowledgements

- [Chitkara University](https://www.chitkara.edu.in) — for the inspiration
- [MongoDB Atlas](https://mongodb.com/atlas) — free cloud database
- [Render](https://render.com) — free backend hosting
- [Vercel](https://vercel.com) — free frontend hosting
- [Tailwind CSS](https://tailwindcss.com) — amazing styling framework
- [React Router](https://reactrouter.com) — seamless page navigation

---

<div align="center">

Made with ❤️ for Chitkara University

**"Connecting Students & Faculty, One Click at a Time"**

⭐ Star this repo if it helped you!

</div>
```

---

## 📁 Where These Files Go

```
chitkara-connect/        ← ROOT of your project
├── .gitignore           ← file 1 goes HERE (root level)
├── README.md            ← file 2 goes HERE (root level)
├── client/
└── server/
```
