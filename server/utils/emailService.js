// =============================================
// server/utils/emailService.js
// =============================================
// Sends transactional emails using Nodemailer.
//
// Setup (add to server/.env):
//   EMAIL_USER=your.gmail@gmail.com
//   EMAIL_PASS=xxxx xxxx xxxx xxxx   ← Gmail App Password
//               (NOT your regular password)
//
// How to get a Gmail App Password:
//   1. Go to myaccount.google.com → Security
//   2. Enable 2-Step Verification
//   3. Search "App passwords" → create one for "Mail"
//   4. Paste the 16-character code as EMAIL_PASS
//
// If EMAIL_USER is not set in .env, emails are
// silently skipped — so the app never crashes
// just because email isn't configured.
require("dotenv").config({ path: "../.env" });

const nodemailer = require("nodemailer");

// ── Create transporter once at startup ───────
// Lazily initialised so missing env vars don't
// crash the server — they just disable email.
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null; // email not configured — skip silently
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  return transporter;
};

// ── Shared HTML wrapper ───────────────────────
// Wraps any content block in a clean, branded email shell.
const htmlWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ChitkaraConnect</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 28px 32px; text-align: center;">
              <div style="display:inline-block; background:rgba(255,255,255,0.15); border-radius:12px; padding:10px 18px; margin-bottom:12px;">
                <span style="color:#ffffff; font-size:22px; font-weight:900; letter-spacing:-0.5px;">
                  Chitkara<span style="color:#93c5fd;">Connect</span>
                </span>
              </div>
              <p style="color:rgba(255,255,255,0.75); margin:0; font-size:13px;">
                Chitkara University Faculty-Student Portal
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb; border-top:1px solid #e5e7eb; padding: 20px 32px; text-align:center;">
              <p style="margin:0; color:#9ca3af; font-size:12px; line-height:1.6;">
                This email was sent by ChitkaraConnect.<br />
                Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── EMAIL: Meeting request received (to faculty) ──
// Sent when a student books a meeting with faculty
const sendMeetingRequestEmail = async ({ faculty, student, meeting }) => {
  const t = getTransporter();
  if (!t) return; // email not configured — skip

  const dateStr = new Date(meeting.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const html = htmlWrapper(`
    <h2 style="margin:0 0 4px; color:#111827; font-size:20px; font-weight:700;">
      📅 New Meeting Request
    </h2>
    <p style="color:#6b7280; margin:0 0 24px; font-size:14px;">
      A student has requested a meeting with you on ChitkaraConnect.
    </p>

    <!-- Student info card -->
    <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:12px; padding:16px; margin-bottom:20px;">
      <p style="margin:0 0 8px; font-size:13px; font-weight:600; color:#0369a1; text-transform:uppercase; letter-spacing:0.5px;">
        From Student
      </p>
      <p style="margin:0 0 4px; font-size:16px; font-weight:700; color:#0c4a6e;">${student.name}</p>
      <p style="margin:0; font-size:13px; color:#0369a1;">${student.email} · ${student.department} · Year ${student.year || "N/A"}</p>
    </div>

    <!-- Meeting details -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:20px;">
      <p style="margin:0 0 12px; font-size:13px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">
        Meeting Details
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 0; width:28px;">📅</td>
          <td style="padding:4px 0; font-size:14px; color:#374151;"><strong>${dateStr}</strong></td>
        </tr>
        <tr>
          <td style="padding:4px 0;">🕐</td>
          <td style="padding:4px 0; font-size:14px; color:#374151;"><strong>${meeting.timeSlot}</strong></td>
        </tr>
        <tr>
          <td style="padding:4px 0; vertical-align:top;">📝</td>
          <td style="padding:4px 0; font-size:14px; color:#374151;">${meeting.reason}</td>
        </tr>
      </table>
    </div>

    <p style="color:#374151; font-size:14px; line-height:1.6; margin:0 0 20px;">
      Please log in to <strong>ChitkaraConnect</strong> to accept or reject this request.
    </p>

    <div style="text-align:center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/faculty/dashboard"
         style="display:inline-block; background:#1d4ed8; color:#ffffff; text-decoration:none;
                padding:12px 28px; border-radius:10px; font-weight:700; font-size:14px;">
        View Request →
      </a>
    </div>
  `);

  await t.sendMail({
    from:    `"ChitkaraConnect" <${process.env.EMAIL_USER}>`,
    to:      faculty.email,
    subject: `📅 Meeting Request from ${student.name} — ${dateStr}`,
    html,
  });
};

// ── EMAIL: Meeting accepted (to student) ─────────
const sendMeetingAcceptedEmail = async ({ faculty, student, meeting }) => {
  const t = getTransporter();
  if (!t) return;

  const dateStr = new Date(meeting.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const html = htmlWrapper(`
    <div style="text-align:center; margin-bottom:24px;">
      <div style="display:inline-block; background:#d1fae5; border-radius:50%; width:64px; height:64px;
                  line-height:64px; font-size:28px; margin-bottom:12px;">✅</div>
      <h2 style="margin:0 0 4px; color:#065f46; font-size:22px; font-weight:800;">
        Meeting Accepted!
      </h2>
      <p style="margin:0; color:#6b7280; font-size:14px;">
        Your meeting request has been approved.
      </p>
    </div>

    <!-- Faculty info -->
    <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:16px; margin-bottom:20px;">
      <p style="margin:0 0 8px; font-size:13px; font-weight:600; color:#065f46; text-transform:uppercase; letter-spacing:0.5px;">
        Accepted By
      </p>
      <p style="margin:0 0 4px; font-size:16px; font-weight:700; color:#064e3b;">${faculty.name}</p>
      <p style="margin:0; font-size:13px; color:#047857;">
        ${faculty.designation || "Faculty"} · ${faculty.department}
      </p>
    </div>

    <!-- Meeting details -->
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin-bottom:20px;">
      <p style="margin:0 0 12px; font-size:13px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:0.5px;">
        Your Meeting
      </p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:4px 0; width:28px;">📅</td>
          <td style="padding:4px 0; font-size:14px; color:#374151;"><strong>${dateStr}</strong></td>
        </tr>
        <tr>
          <td style="padding:4px 0;">🕐</td>
          <td style="padding:4px 0; font-size:14px; color:#374151;"><strong>${meeting.timeSlot}</strong></td>
        </tr>
        ${faculty.officeAddress ? `
        <tr>
          <td style="padding:4px 0;">📍</td>
          <td style="padding:4px 0; font-size:14px; color:#374151;">${faculty.officeAddress}</td>
        </tr>` : ""}
      </table>
    </div>

    ${meeting.facultyNote ? `
    <!-- Faculty's note -->
    <div style="background:#fffbeb; border-left:4px solid #f59e0b; padding:12px 16px; border-radius:0 8px 8px 0; margin-bottom:20px;">
      <p style="margin:0 0 4px; font-size:12px; font-weight:600; color:#92400e; text-transform:uppercase;">
        Note from ${faculty.name}
      </p>
      <p style="margin:0; font-size:14px; color:#78350f;">${meeting.facultyNote}</p>
    </div>` : ""}

    <p style="color:#374151; font-size:14px; line-height:1.6; margin:0 0 20px;">
      Please be on time and come prepared. You can view all your meetings on ChitkaraConnect.
    </p>

    <div style="text-align:center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/student/dashboard"
         style="display:inline-block; background:#059669; color:#ffffff; text-decoration:none;
                padding:12px 28px; border-radius:10px; font-weight:700; font-size:14px;">
        View My Meetings →
      </a>
    </div>
  `);

  await t.sendMail({
    from:    `"ChitkaraConnect" <${process.env.EMAIL_USER}>`,
    to:      student.email,
    subject: `✅ Meeting Accepted by ${faculty.name} — ${dateStr}`,
    html,
  });
};

// ── EMAIL: Meeting rejected (to student) ─────────
const sendMeetingRejectedEmail = async ({ faculty, student, meeting }) => {
  const t = getTransporter();
  if (!t) return;

  const dateStr = new Date(meeting.date).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const html = htmlWrapper(`
    <div style="text-align:center; margin-bottom:24px;">
      <div style="display:inline-block; background:#fee2e2; border-radius:50%; width:64px; height:64px;
                  line-height:64px; font-size:28px; margin-bottom:12px;">❌</div>
      <h2 style="margin:0 0 4px; color:#991b1b; font-size:22px; font-weight:800;">
        Meeting Not Available
      </h2>
      <p style="margin:0; color:#6b7280; font-size:14px;">
        Your meeting request could not be accommodated.
      </p>
    </div>

    <!-- Faculty info -->
    <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:12px; padding:16px; margin-bottom:20px;">
      <p style="margin:0 0 4px; font-size:14px; color:#7f1d1d;">
        <strong>${faculty.name}</strong> (${faculty.designation || "Faculty"} · ${faculty.department})
        was unable to accept your meeting on <strong>${dateStr}</strong> at <strong>${meeting.timeSlot}</strong>.
      </p>
    </div>

    ${meeting.facultyNote ? `
    <!-- Reason -->
    <div style="background:#fff7ed; border-left:4px solid #f97316; padding:12px 16px; border-radius:0 8px 8px 0; margin-bottom:20px;">
      <p style="margin:0 0 4px; font-size:12px; font-weight:600; color:#7c2d12; text-transform:uppercase;">
        Reason from Faculty
      </p>
      <p style="margin:0; font-size:14px; color:#7c2d12;">${meeting.facultyNote}</p>
    </div>` : ""}

    <p style="color:#374151; font-size:14px; line-height:1.6; margin:0 0 20px;">
      Don't worry — you can book another time slot that works better for ${faculty.name}.
    </p>

    <div style="text-align:center;">
      <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/student/dashboard"
         style="display:inline-block; background:#1d4ed8; color:#ffffff; text-decoration:none;
                padding:12px 28px; border-radius:10px; font-weight:700; font-size:14px;">
        Book Another Slot →
      </a>
    </div>
  `);

  await t.sendMail({
    from:    `"ChitkaraConnect" <${process.env.EMAIL_USER}>`,
    to:      student.email,
    subject: `Meeting Update from ${faculty.name} — ${dateStr}`,
    html,
  });
};

module.exports = {
  sendMeetingRequestEmail,
  sendMeetingAcceptedEmail,
  sendMeetingRejectedEmail,
};
