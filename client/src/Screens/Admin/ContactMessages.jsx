import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../baseUrl";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    axios
      .get(`${baseApiURL()}/contact/getMessages`)
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.messages);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load messages");
      });
  };

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10">
      <div className="flex justify-between items-center w-full">
        <Heading title="Contact Messages" />
      </div>

      <div className="mt-8 w-full grid grid-cols-1 gap-6">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No contact messages received yet.</p>
        ) : (
          messages.map((msg) => {
            const date = new Date(msg.createdAt).toLocaleString();
            return (
              <div key={msg._id} style={{
                background: "#f8fafc", border: "1px solid #e2e8f0",
                borderRadius: 12, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>{msg.name}</h3>
                    <p style={{ color: "#6366f1", fontSize: 14, margin: "4px 0 0", fontWeight: 500 }}>
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </p>
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, background: "#f1f5f9", padding: "4px 10px", borderRadius: 20 }}>
                    {date}
                  </span>
                </div>
                
                <div style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: 16,
                  color: "#334155", fontSize: 15, lineHeight: 1.6, whiteSpace: "pre-wrap", marginTop: 16
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ContactMessages;
