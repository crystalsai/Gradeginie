const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
