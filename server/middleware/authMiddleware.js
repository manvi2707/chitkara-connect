const jwt = require("jsonwebtoken");

// ── MIDDLEWARE 1: protect ────────────────────
// Checks if the user has a valid JWT token
// Add this to ANY route you want to protect
const protect = (req, res, next) => {

  // Every protected request must send this header:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
  const authHeader = req.headers.authorization;

  // If header is missing or doesn't start with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. Please log in." });
  }

  // Split "Bearer eyJhbG..." → take only the token part
  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify checks:
    // 1. Is the token valid?
    // 2. Was it signed with our JWT_SECRET?
    // 3. Has it expired?
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded looks like: { id: "64abc123", role: "student", iat: ..., exp: ... }
    // Attach it to req so any route below can use req.user
    req.user = decoded;

    next(); // ✅ token is valid, move to the actual route
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};

// ── MIDDLEWARE 2: studentOnly ────────────────
// Use AFTER protect — blocks faculty from student routes
const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};

// ── MIDDLEWARE 3: facultyOnly ────────────────
// Use AFTER protect — blocks students from faculty routes
const facultyOnly = (req, res, next) => {
  if (req.user.role !== "faculty") {
    return res.status(403).json({ message: "Access denied. Faculty only." });
  }
  next();
};

module.exports = { protect, studentOnly, facultyOnly };