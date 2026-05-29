import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Profile from "./Profile";
import Timetable from "./Timetable";
import Marks from "./Marks";
import Notice from "../../components/Notice";
import Material from "./Material";
import { Toaster } from "react-hot-toast";
import CampusConnect from "../../components/CampusConnect";
import { FiUser, FiCalendar, FiAward, FiBook, FiBell, FiMessageSquare } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("My Profile");
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  const menuItems = [
    { id: "My Profile", icon: <FiUser />, label: "My Profile" },
    { id: "Timetable", icon: <FiCalendar />, label: "Timetable" },
    { id: "Marks", icon: <FiAward />, label: "Marks" },
    { id: "Material", icon: <FiBook />, label: "Material" },
    { id: "Notice", icon: <FiBell />, label: "Notice" },
    { id: "Chat", icon: <FiMessageSquare />, label: "Campus Chat" },
  ];

  return (
    <section style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "'Inter', 'Poppins', sans-serif" }}>
      {load && (
        <>
          <Navbar />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
            {/* Top Navigation Tabs */}
            <div style={{
              display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8,
              marginBottom: 32, WebkitOverflowScrolling: "touch",
            }}>
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMenu(item.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "12px 24px", borderRadius: 12, border: "none",
                    cursor: "pointer", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
                    background: selectedMenu === item.id ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "rgba(255,255,255,0.05)",
                    color: selectedMenu === item.id ? "#fff" : "#94a3b8",
                    boxShadow: selectedMenu === item.id ? "0 4px 15px rgba(99,102,241,0.3)" : "none",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={e => { if (selectedMenu !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={e => { if (selectedMenu !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Content Container */}
            <div style={{
              background: "#ffffff", borderRadius: 24, padding: "2rem",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)", minHeight: "60vh",
              color: "#0f172a"
            }}>
              {selectedMenu === "Timetable" && <Timetable />}
              {selectedMenu === "Marks" && <Marks />}
              {selectedMenu === "Material" && <Material />}
              {selectedMenu === "Notice" && <Notice />}
              {selectedMenu === "My Profile" && <Profile />}
              {selectedMenu === "Chat" && <CampusConnect />}
            </div>
          </div>
        </>
      )}
      <Toaster position="bottom-center" />
    </section>
  );
};

export default Home;
