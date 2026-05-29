const express = require("express");
const router = express.Router();
const Chat = require("../../models/Other/chat.model");

router.get("/getMessages", async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 }).limit(100);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/sendMessage", async (req, res) => {
  try {
    const { sender, role, message } = req.body;
    if (!sender || !role || !message) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const newChat = await Chat.create({ sender, role, message });
    res.status(200).json({ success: true, message: "Message sent", chat: newChat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
