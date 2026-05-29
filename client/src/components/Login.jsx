import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiLogIn, FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseApiURL } from "../baseUrl";

const Login = ({ onBackToLanding }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Student");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    if (data.loginid !== "" && data.password !== "") {
      const headers = { "Content-Type": "application/json" };
      toast.loading("Authenticating...");
      axios
        .post(`${baseApiURL()}/${selected.toLowerCase()}/auth/login`, data, { headers })
        .then((response) => {
          toast.dismiss();
          toast.success("Login successful!");
          navigate(`/${selected.toLowerCase()}`, {
            state: { type: selected, loginid: response.data.loginid },
          });
        })
        .catch((error) => {
          toast.dismiss();
          toast.error(error.response?.data?.message || "Login failed");
        });
    }
  };

  const roles = [
    { id: "Student", icon: "🎓", color: "#6366f1" },
    { id: "Faculty", icon: "👨‍🏫", color: "#059669" },
    { id: "Admin", icon: "⚙️", color: "#7c3aed" },
  ];

  return (
    <div style={{
      minHeight: "100vh", display: "flex", fontFamily: "'Inter','Poppins',sans-serif",
      background: "#0f172a", position: "relative", overflow: "hidden",
    }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: "15%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

      {/* Left panel — Illustration */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "3rem", position: "relative", zIndex: 10,
        background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(124,58,237,0.05) 100%)",
        borderRight: "1px solid rgba(99,102,241,0.1)",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff" }}>E</div>
          <span style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
            Edu<span style={{ color: "#818cf8" }}>Portal</span>
          </span>
        </div>

        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <div style={{ fontSize: 80, marginBottom: 24 }}>🎓</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12, letterSpacing: -0.5 }}>
            Welcome to the <br />
            <span style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Academic Portal</span>
          </h2>
          <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 15 }}>
            Your gateway to marks, study materials, timetables, and campus life — all in one secure platform.
          </p>
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 40, justifyContent: "center", maxWidth: 380 }}>
          {["📊 View Marks", "📚 Study Materials", "🗓️ Timetables", "📢 Notices", "👤 Profile"].map(f => (
            <span key={f} style={{
              padding: "6px 16px", borderRadius: 50, fontSize: 13, fontWeight: 500,
              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
              color: "#818cf8",
            }}>{f}</span>
          ))}
        </div>

        {/* Back to landing */}
        {onBackToLanding && (
          <button onClick={onBackToLanding} style={{
            marginTop: 40, background: "none", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 10, padding: "10px 24px", cursor: "pointer",
            color: "#818cf8", fontSize: 13, fontWeight: 600,
          }}>← Back to Home</button>
        )}
      </div>

      {/* Right panel — Login form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem", maxWidth: 520, position: "relative", zIndex: 10
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 6, letterSpacing: -0.5 }}>
            {selected} Login
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>
            Sign in to access your {selected.toLowerCase()} dashboard
          </p>

          {/* Role selector */}
          <div style={{ display: "flex", gap: 10, marginBottom: 32, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 6 }}>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: 8, border: "none",
                  cursor: "pointer", fontSize: 13, fontWeight: 600,
                  background: selected === r.id ? "linear-gradient(135deg, #6366f1, #7c3aed)" : "transparent",
                  color: selected === r.id ? "#fff" : "#64748b",
                  transition: "all 0.25s",
                  boxShadow: selected === r.id ? "0 4px 15px rgba(99,102,241,0.4)" : "none",
                }}
              >
                {r.icon} {r.id}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="loginid" style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                {selected} Login ID
              </label>
              <div style={{ position: "relative" }}>
                <FiUser style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 16 }} />
                <input
                  id="loginid"
                  type="number"
                  required
                  placeholder="Enter your login ID"
                  {...register("loginid")}
                  style={{
                    width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                    color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
                />
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label htmlFor="password" style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#64748b", fontSize: 16 }} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  {...register("password")}
                  style={{
                    width: "100%", padding: "14px 48px 14px 44px", borderRadius: 12,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                    color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
                  onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.2)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: "100%", padding: "15px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 6px 25px rgba(99,102,241,0.4)",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 35px rgba(99,102,241,0.6)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 6px 25px rgba(99,102,241,0.4)"}
            >
              Sign In <FiLogIn />
            </button>
          </form>

          <p style={{ textAlign: "center", color: "#475569", fontSize: 12, marginTop: 24 }}>
            Admin demo password: admin123. Student and faculty passwords are set by admin.
          </p>
        </div>
      </div>

      <Toaster position="bottom-center" toastOptions={{
        style: { background: "#1e293b", color: "#e2e8f0", border: "1px solid rgba(99,102,241,0.3)" }
      }} />

      <style>{`
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

export default Login;
