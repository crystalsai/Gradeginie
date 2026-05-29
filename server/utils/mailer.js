const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a welcome email to a new student or staff member.
 * @param {string} to - Recipient email
 * @param {string} name - Recipient full name
 * @param {string} loginid - Login ID (enrollment/employee ID)
 * @param {string} password - Plain-text password (initial)
 * @param {"Student"|"Faculty"} role - Role of the recipient
 */
const sendWelcomeEmail = async (to, name, loginid, password, role) => {
  const collegeName = process.env.COLLEGE_NAME || "EduPortal College";
  const subject = `Welcome to ${collegeName} — Your ${role} Account`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body { margin:0; padding:0; background:#0f172a; font-family:'Segoe UI',Arial,sans-serif; }
        .wrapper { max-width:600px; margin:40px auto; background:linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%); border-radius:16px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5); }
        .header { background:linear-gradient(135deg,#6366f1 0%,#4f46e5 50%,#7c3aed 100%); padding:40px 32px; text-align:center; }
        .header h1 { color:#fff; margin:0; font-size:28px; font-weight:700; letter-spacing:-0.5px; }
        .header p { color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:15px; }
        .logo-icon { font-size:48px; margin-bottom:12px; display:block; }
        .body { padding:40px 32px; }
        .greeting { color:#e2e8f0; font-size:18px; font-weight:600; margin-bottom:8px; }
        .intro { color:#94a3b8; font-size:15px; line-height:1.7; margin-bottom:28px; }
        .creds-box { background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); border-radius:12px; padding:24px; margin-bottom:28px; }
        .creds-title { color:#a5b4fc; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px; }
        .cred-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .cred-row:last-child { margin-bottom:0; }
        .cred-label { color:#94a3b8; font-size:14px; }
        .cred-value { color:#e2e8f0; font-size:15px; font-weight:700; background:rgba(255,255,255,0.1); padding:6px 16px; border-radius:8px; font-family:monospace; }
        .warning { background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:14px 20px; color:#fcd34d; font-size:13px; margin-bottom:28px; }
        .warning strong { color:#fbbf24; }
        .btn { display:inline-block; background:linear-gradient(135deg,#6366f1,#7c3aed); color:#fff; text-decoration:none; padding:14px 32px; border-radius:10px; font-size:15px; font-weight:600; text-align:center; margin-bottom:28px; }
        .features { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:28px; }
        .feature { background:rgba(255,255,255,0.05); border-radius:10px; padding:16px; }
        .feature-icon { font-size:22px; margin-bottom:6px; display:block; }
        .feature-title { color:#e2e8f0; font-size:13px; font-weight:600; }
        .feature-desc { color:#64748b; font-size:12px; margin-top:4px; }
        .footer { border-top:1px solid rgba(255,255,255,0.08); padding:24px 32px; text-align:center; color:#475569; font-size:13px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="logo-icon">🎓</span>
          <h1>${collegeName}</h1>
          <p>Academic Management Portal</p>
        </div>
        <div class="body">
          <p class="greeting">Welcome, ${name}! 👋</p>
          <p class="intro">
            Your <strong style="color:#a5b4fc">${role}</strong> account has been successfully created. 
            Below are your login credentials to access the ${collegeName} Academic Portal. 
            Please keep them safe and confidential.
          </p>
          
          <div class="creds-box">
            <div class="creds-title">🔐 Your Login Credentials</div>
            <div class="cred-row">
              <span class="cred-label">Login ID</span>
              <span class="cred-value">${loginid}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Password</span>
              <span class="cred-value">${password}</span>
            </div>
            <div class="cred-row">
              <span class="cred-label">Role</span>
              <span class="cred-value">${role}</span>
            </div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> Please change your password after your first login. Do not share these credentials with anyone.
          </div>
          
          <div class="features">
            <div class="feature">
              <span class="feature-icon">📊</span>
              <div class="feature-title">View Marks</div>
              <div class="feature-desc">Access your academic performance records</div>
            </div>
            <div class="feature">
              <span class="feature-icon">📚</span>
              <div class="feature-title">Study Material</div>
              <div class="feature-desc">Download PDFs and video resources</div>
            </div>
            <div class="feature">
              <span class="feature-icon">🗓️</span>
              <div class="feature-title">Timetable</div>
              <div class="feature-desc">Check your class schedule anytime</div>
            </div>
            <div class="feature">
              <span class="feature-icon">📢</span>
              <div class="feature-title">Notices</div>
              <div class="feature-desc">Stay updated with announcements</div>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${collegeName}. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${collegeName}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Welcome email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
  }
};

/**
 * Send study material notification to all students in a branch/subject.
 * @param {string[]} emails - List of student emails
 * @param {string} materialTitle - Title of the material
 * @param {string} subject - Subject name
 * @param {string} faculty - Faculty name
 * @param {string} materialType - "pdf" | "video"
 * @param {string} link - Optional link (for video)
 */
const sendMaterialNotification = async (emails, materialTitle, subject, faculty, materialType, link) => {
  const collegeName = process.env.COLLEGE_NAME || "EduPortal College";
  const emailSubject = `📚 New Study Material Added — ${materialTitle}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <style>
        body { margin:0; padding:0; background:#0f172a; font-family:'Segoe UI',Arial,sans-serif; }
        .wrapper { max-width:600px; margin:40px auto; background:linear-gradient(135deg,#1e3a5f 0%,#0f172a 100%); border-radius:16px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.5); }
        .header { background:linear-gradient(135deg,#059669 0%,#0d9488 100%); padding:32px; text-align:center; }
        .header h1 { color:#fff; margin:0; font-size:24px; font-weight:700; }
        .header p { color:rgba(255,255,255,0.85); margin:6px 0 0; }
        .body { padding:36px 32px; }
        .material-card { background:rgba(5,150,105,0.1); border:1px solid rgba(5,150,105,0.3); border-radius:12px; padding:24px; margin-bottom:24px; }
        .label { color:#6ee7b7; font-size:12px; font-weight:700; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px; }
        .value { color:#e2e8f0; font-size:16px; font-weight:600; margin-bottom:16px; }
        .badge { display:inline-block; background:rgba(5,150,105,0.3); color:#6ee7b7; padding:4px 14px; border-radius:20px; font-size:12px; font-weight:700; text-transform:uppercase; }
        .link-btn { display:inline-block; background:linear-gradient(135deg,#059669,#0d9488); color:#fff; text-decoration:none; padding:12px 28px; border-radius:10px; font-size:14px; font-weight:600; margin-top:12px; }
        .footer { border-top:1px solid rgba(255,255,255,0.08); padding:20px 32px; text-align:center; color:#475569; font-size:13px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>📚 New Study Material Available</h1>
          <p>${collegeName} Academic Portal</p>
        </div>
        <div class="body">
          <p style="color:#94a3b8;margin-bottom:24px;">A new study material has been uploaded to the portal. Login to access it.</p>
          <div class="material-card">
            <div class="label">Material Title</div>
            <div class="value">${materialTitle}</div>
            <div class="label">Subject</div>
            <div class="value">${subject}</div>
            <div class="label">Uploaded By</div>
            <div class="value">${faculty}</div>
            <div class="label">Type</div>
            <div class="value"><span class="badge">${materialType === "video" ? "🎬 Video Link" : "📄 PDF Document"}</span></div>
            ${link ? `<a href="${link}" class="link-btn">▶ Watch Video</a>` : ""}
          </div>
          <p style="color:#64748b;font-size:13px;">Log in to your Student Portal to download or view this material.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ${collegeName}. All rights reserved.</p>
          <p>This is an automated notification. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // Send in batches to avoid rate limiting
    for (const email of emails) {
      await transporter.sendMail({
        from: `"${collegeName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: emailSubject,
        html,
      });
    }
    console.log(`✅ Material notification sent to ${emails.length} students`);
  } catch (err) {
    console.error("❌ Material notification email failed:", err.message);
  }
};

const sendContactEmail = async (name, email, message) => {
  const collegeName = process.env.COLLEGE_NAME || "EduPortal College";
  const subject = `New Contact Form Submission from ${name}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
      <h2 style="color: #4f46e5; margin-top: 0;">New Message via Contact Form</h2>
      <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
      <div style="background: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 20px;">
        <p style="margin: 0; color: #374151; white-space: pre-wrap;">${message}</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${collegeName} Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self (admin)
      replyTo: email,
      subject,
      html,
    });
    console.log(`✅ Contact email sent from ${name}`);
    return true;
  } catch (err) {
    console.error("❌ Contact email failed:", err.message);
    return false;
  }
};

module.exports = { sendWelcomeEmail, sendMaterialNotification, sendContactEmail };
