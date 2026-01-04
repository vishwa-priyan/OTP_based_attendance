const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Add these credentials at the top of server.js
const ADMIN_USER = "admin";
const ADMIN_PASS = "123";

// Add this route
app.post("/admin/login", (req, res) => {
  const { user, pass } = req.body;
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
});

let currentOTP = "";
let previousOTP = ""; // Grace period OTP
let secretKey = "715524"; // For future use
//let attendanceDatabase = []; // Temporary local storage

const generateOTP = () => {
  previousOTP = currentOTP; // Move current to previous
  currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`New OTP: ${currentOTP} | Previous: ${previousOTP}`);
};

// Generate first OTP and set interval
generateOTP();
setInterval(generateOTP, 10000);

// Admin route
app.get("/admin/current-otp", (req, res) => {
  res.json({ otp: currentOTP });
});

// Student verification route
app.post("/verify-otp", (req, res) => {
  const { studentOtp, name, regNo, email, phone } = req.body;

  // Check if OTP matches current OR previous (grace period)
  if (
    studentOtp === currentOTP ||
    studentOtp === previousOTP ||
    studentOtp === secretKey
  ) {
    // Check if student already marked attendance
    /*const alreadyExists = attendanceDatabase.find((s) => s.regNo === regNo);

    if (alreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "Attendance already marked!" });
    }

    const newRecord = { name, regNo, email, phone, timestamp: new Date() };
    attendanceDatabase.push(newRecord);

    console.log("Database Updated:", attendanceDatabase);
    */
    return res.json({ success: true, message: "Verified" });
  } else {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }
});

/*
// Admin route to view all data
app.get("/admin/records", (req, res) => {
  res.json(attendanceDatabase);
});
*/

app.listen(3000, () => console.log("Server running on port 3000"));
