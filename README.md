# ChitkaraConnect 🎓

A full-stack faculty-student portal for Chitkara University — built with React.js, Node.js, Express, MongoDB, and Socket.io.

---

## ✨ Features

### Authentication
- Separate login/register flows for **Students** and **Faculty**
- JWT-based authentication with 7-day token expiry
- Role-based route protection (student-only / faculty-only)
- Passwords hashed with bcrypt (12 rounds)

### Faculty Directory (Student View)
- Browse all registered faculty members
- Filter by department and availability
- Search by name, expertise, or designation
- **Direct message** faculty from their card
- **Book a meeting** with available faculty

### Meeting System
- Students book meetings with specific time slots
- Slot availability auto-calculated from faculty visiting hours
- Conflict detection prevents double-booking
- Faculty accept / reject requests with optional notes
- Faculty availability auto-toggles when all slots are booked

### Messaging (WhatsApp-style)
- Real-time conversations powered by **Socket.io**
- WhatsApp-style delivery receipts (✓ sent, ✓✓ delivered, 🔵 read)
- Typing indicators and online presence
- Unread badge counts in sidebar
- Direct message initiation from Faculty Directory

### AI Chatbot (ChitkaraBot)
- Floating chatbot widget on the student dashboard
- Powered by **Groq API** (LLaMA 3.1 8B Instant)
- Answers questions about faculty, courses, and campus
- Speech-to-text via Web Speech API

### Profile Management
- **Faculty**: edit name, department, designation, bio, expertise, office address, visiting hours, phone, availability toggle
- **Students**: edit name, year, roll number
- Profile photo upload via **Cloudinary** (drag-and-drop)
- Photo updates reflect instantly everywhere (navbar, cards, messages)

### Account Settings
- Change password (with current password verification)
- **Delete account** — permanently removes the user and ALL their data:
  - All meetings (booked/received)
  - All messages and conversations
  - Profile photo from Cloudinary

### Campus Info
- Interactive campus map / info section

---

## 🛠️ Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React.js, Tailwind CSS              |
| Backend     | Node.js, Express.js                 |
| Database    | MongoDB + Mongoose                  |
| Auth        | JWT (jsonwebtoken) + bcryptjs       |
| Real-time   | Socket.io                           |
| File Upload | Cloudinary + Multer                 |
| AI          | Groq API (LLaMA 3.1 8B)            |
| Deployment  | Render (backend) + Vercel (frontend)|

---

## 📁 Project Structure

```
chitkara-connect/
├── client/                     # React frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── FacultyCard.jsx        # With Message button
│       │   ├── BookMeetingModal.jsx
│       │   ├── ChatbotWidget.jsx
│       │   ├── DeleteAccountModal.jsx # NEW
│       │   ├── PhotoUpload.jsx
│       │   ├── UserAvatar.jsx
│       │   └── Toast.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── LoginStudent.jsx
│       │   ├── LoginFaculty.jsx
│       │   ├── StudentDashboard.jsx
│       │   ├── FacultyDashboard.jsx
│       │   ├── FacultyDirectory.jsx
│       │   ├── FacultyProfileEdit.jsx # With change password + danger zone
│       │   ├── StudentSettings.jsx    # NEW — profile + password + delete
│       │   ├── Meetings.jsx
│       │   ├── Messages.jsx
│       │   └── CollegeMap.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       └── utils/
│           └── api.js
│
└── server/                     # Express backend
    ├── controllers/
    │   ├── authController.js
    │   ├── facultyController.js
    │   ├── studentController.js       # NEW
    │   ├── meetingController.js
    │   ├── messageController.js
    │   ├── availabilityController.js
    │   ├── uploadController.js
    │   ├── chatbotController.js
    │   ├── changePasswordController.js # NEW
    │   └── deleteAccountController.js  # NEW
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    ├── models/
    │   ├── Student.js
    │   ├── Faculty.js
    │   ├── Meeting.js
    │   ├── Message.js
    │   └── Conversation.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── facultyRoutes.js
    │   ├── studentRoutes.js    # NEW
    │   ├── meetingRoutes.js
    │   ├── messageRoutes.js
    │   ├── uploadRoutes.js
    │   ├── availabilityRoutes.js
    │   └── chatbotRoutes.js
    ├── utils/
    │   ├── cloudinary.js
    │   └── timeSlotUtils.js
    └── server.js
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account
- Groq API key (free at console.groq.com)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/chitkara-connect.git
cd chitkara-connect
```

### 2. Server setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://...your Atlas URI...
JWT_SECRET=your_super_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GROQ_API_KEY=gsk_...your_groq_key...
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```

### 3. Client setup
```bash
cd client
npm install
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

```bash
npm start
```

App runs at **http://localhost:3000**

---

## 🌐 API Reference

### Auth Routes (`/api/auth`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/student/register` | ❌ | Register student |
| POST | `/student/login` | ❌ | Login student |
| POST | `/faculty/register` | ❌ | Register faculty |
| POST | `/faculty/login` | ❌ | Login faculty |
| PUT | `/change-password` | ✅ | Change password (any role) |
| DELETE | `/delete-account` | ✅ | Delete account + all data |

### Faculty Routes (`/api/faculty`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | ❌ | Get all faculty |
| GET | `/:id` | ❌ | Get faculty by ID |
| PUT | `/profile/update` | ✅ Faculty | Update own profile |

### Student Routes (`/api/student`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/profile` | ✅ Student | Get own profile |
| PUT | `/profile` | ✅ Student | Update own profile |

### Meeting Routes (`/api/meetings`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/book` | ✅ Student | Book a meeting |
| GET | `/my-meetings` | ✅ Student | Get student's meetings |
| GET | `/faculty-meetings` | ✅ Faculty | Get faculty's meetings |
| PUT | `/:meetingId/respond` | ✅ Faculty | Accept/reject meeting |

### Message Routes (`/api/messages`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/conversations` | ✅ | Get all conversations |
| POST | `/conversations/open` | ✅ | Open/create conversation |
| GET | `/conversations/:id/messages` | ✅ | Get thread messages |
| POST | `/send` | ✅ | Send a message |

---

## 🚢 Deployment

### Backend → Render
1. Push code to GitHub
2. Create new **Web Service** on [render.com](https://render.com)
3. Connect your GitHub repo, set root to `/server`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `.env`
7. **Important**: Remove `tlsAllowInvalidCertificates: true` from `server.js`

### Frontend → Vercel
1. Create new project on [vercel.com](https://vercel.com)
2. Set root to `/client`
3. Add env variables:
   - `REACT_APP_API_URL=https://your-render-app.onrender.com/api`
   - `REACT_APP_SOCKET_URL=https://your-render-app.onrender.com`
4. Deploy!

---

## 🔮 Future Improvements
- [ ] Email notifications when meeting is accepted/rejected (Nodemailer ready)
- [ ] Admin panel to manage all users and meetings
- [ ] Pagination for faculty directory and meetings list
- [ ] Push notifications (PWA)
- [ ] Dark mode
- [ ] Export meetings to calendar (iCal)

---

## 👩‍💻 Author

**Manvi** — Chitkara University, B.Tech CSE  
Built as a full-stack project demonstrating MERN, JWT auth, real-time communication, and AI integration.

---

## 📄 License

MIT License — free to use and modify.
