const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const facultySchema = new mongoose.Schema(
  {
    // ── Basic Info ──────────────────────────
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    // ── Academic Info ───────────────────────
    department: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "ME", "CE", "IT", "MBA", "Other"],
    },
    designation: {
      type: String,
      default: "Assistant Professor",
      // e.g. "Professor", "Associate Professor", "HOD"
    },

    // ── Faculty-Specific Fields ─────────────
    expertise: {
      type: [String],   // array — e.g. ["Machine Learning", "DBMS"]
      default: [],
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    officeAddress: {
      type: String,
      default: "", // e.g. "Room 204, Block A"
    },
    visitingHours: {
      type: String,
      default: "", // e.g. "Mon-Wed: 10am-12pm"
    },
    phone: {
      type: String,
      default: "",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    isAvailable: {
      type: Boolean,
      default: true,  // faculty can turn this off when busy
    },
  },
  { timestamps: true }
);

// Hash password before saving (same logic as Student model)
facultySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

facultySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Faculty", facultySchema);