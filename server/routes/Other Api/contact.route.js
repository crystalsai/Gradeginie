const express = require("express");
const router = express.Router();
const { sendContactEmail } = require("../../utils/mailer");
const Contact = require("../../models/Other/contact.model");

router.get("/getMessages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/send", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Save to DB
    await Contact.create({ name, email, message });

    // Also attempt to send email
    sendContactEmail(name, email, message).catch(console.error);

    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
