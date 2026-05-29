import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FiSend, FiMessageSquare } from "react-icons/fi";
import { baseApiURL } from "../baseUrl";
import { useLocation } from "react-router-dom";

const CampusConnect = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { fullname } = useSelector((state) => state.userData);
  const router = useLocation();
  const messagesEndRef = useRef(null);

  // Role resolution
  const role = router.state?.type || "Student";
  const userName = fullname || "Anonymous";

  const fetchMessages = () => {
    axios.get(`${baseApiURL()}/chat/getMessages`)
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    axios.post(`${baseApiURL()}/chat/sendMessage`, {
      sender: userName,
      role: role,
      message: newMessage,
    }).then((res) => {
      if (res.data.success) {
        setMessages([...messages, res.data.chat]);
        setNewMessage("");
      }
    }).catch((err) => console.error(err));
  };

  return (
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", height: "65vh", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.1)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
          <FiMessageSquare />
        </div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", margin: 0, letterSpacing: -0.5 }}>Campus Connect</h2>
          <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>Global chat for students, faculty, and admins</p>
        </div>
      </div>

      <div style={{
        flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16,
        padding: 20, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16
      }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#94a3b8", marginTop: "auto", marginBottom: "auto" }}>No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender === userName && msg.role === role;
            const roleColor = msg.role === "Admin" ? "#7c3aed" : msg.role === "Faculty" ? "#059669" : "#6366f1";
            
            return (
              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: roleColor, marginBottom: 4, padding: "0 4px" }}>
                  {msg.sender} ({msg.role})
                </span>
                <div style={{
                  maxWidth: "75%", padding: "12px 16px", borderRadius: 16,
                  borderBottomRightRadius: isMe ? 4 : 16,
                  borderBottomLeftRadius: !isMe ? 4 : 16,
                  background: isMe ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "#fff",
                  color: isMe ? "#fff" : "#334155",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  fontSize: 14, lineHeight: 1.5, wordBreak: "break-word"
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: "flex", gap: 12, marginTop: 20 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1, padding: "14px 20px", borderRadius: 12, border: "1px solid #cbd5e1",
            background: "#fff", outline: "none", fontSize: 14, color: "#334155"
          }}
        />
        <button type="submit" style={{
          padding: "0 24px", borderRadius: 12, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #6366f1, #7c3aed)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          boxShadow: "0 4px 15px rgba(99,102,241,0.3)"
        }}>
          <FiSend />
        </button>
      </form>
    </div>
  );
};

export default CampusConnect;
