import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  

  const roleColors = {
    Student: { accent: "#6366f1", bg: "rgba(99,102,241,0.1)" },
    Faculty: { accent: "#059669", bg: "rgba(5,150,105,0.1)" },
    Admin: { accent: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
  };
  const role = router.state?.type || "Portal";
  const color = roleColors[role] || { accent: "#818cf8", bg: "rgba(99,102,241,0.1)" };

  const roleIcons = { Student: "🎓", Faculty: "👨‍🏫", Admin: "⚙️" };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(15,23,42,0.95)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(99,102,241,0.12)",
      fontFamily: "'Inter','Poppins',sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        {/* Logo + Role */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", cursor: "pointer" }} onClick={() => navigate("/")}>E</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.1, cursor: "pointer" }} onClick={() => navigate("/")}>
              Edu<span style={{ color: "#818cf8" }}>Portal</span>
            </div>
            {role !== "Portal" && (
              <div style={{ fontSize: 11, color: color.accent, fontWeight: 600, letterSpacing: 0.5 }}>
                {roleIcons[role]} {role} Dashboard
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {role !== "Portal" && (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 8,
              background: color.bg, border: `1px solid ${color.accent}33`,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color.accent }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: color.accent }}>
                {router.state?.loginid && `ID: ${router.state.loginid}`}
              </span>
            </div>
          )}
          <button
            id="navbar-logout-btn"
            onClick={() => navigate("/")}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
              borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.08)", cursor: "pointer",
              color: "#f87171", fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
          >
            <FiLogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
