const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,        // removes extra spaces automatically
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,      // no two students can have the same email
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    department: {
      type: String,
      required: true,
      enum: ["CSE", "ECE", "ME", "CE", "IT", "MBA", "Other"], // only these values allowed
    },
    year: {
      type: Number,
      min: 1,
      max: 5,
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,      // allows multiple students to have no roll number
    },
    profilePhoto: {
      type: String,
      default: "",       // stores a URL to the photo
    },
  },
  { timestamps: true }   // auto-adds createdAt and updatedAt
);

// Runs before every .save() — hashes the password so it's never stored as plain text
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check login password against the stored hash
studentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Student", studentSchema);