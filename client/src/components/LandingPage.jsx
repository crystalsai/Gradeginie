import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseApiURL } from "../baseUrl";
// Animated Counter
const Counter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 25);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const LandingPage = ({ onLoginClick }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["home", "about", "services", "contact"];
      for (const s of sections.reverse()) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseApiURL()}/contact/send`, formData);
      if (response.data.success) {
        setFormSent(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setFormSent(false), 4000);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again later.");
    }
  };

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div style={{ fontFamily: "'Inter', 'Poppins', sans-serif", background: "#0f172a", color: "#e2e8f0", overflowX: "hidden" }}>
      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(15,23,42,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,0.2)" : "none",
        transition: "all 0.4s ease",
        padding: "0 2rem",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("home")}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "#fff",
            }}>E</div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>
              Edu<span style={{ color: "#818cf8" }}>Portal</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                border: "none", cursor: "pointer", padding: "8px 16px",
                borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: activeSection === l.id ? "#818cf8" : "#94a3b8",
                background: activeSection === l.id ? "rgba(99,102,241,0.1)" : "transparent",
                transition: "all 0.2s",
              }}>{l.label}</button>
            ))}
            <button onClick={onLoginClick} style={{
              marginLeft: 8,
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              border: "none", cursor: "pointer", padding: "10px 24px",
              borderRadius: 10, fontSize: 14, fontWeight: 600, color: "#fff",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              transition: "all 0.2s",
            }}>Login Portal</button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", paddingTop: 70 }}>
        {/* Animated blobs */}
        <div style={{ position: "absolute", top: "10%", left: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
        
        {/* Grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "4rem 2rem", position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          
          {/* Left Text */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px",
              borderRadius: 50, border: "1px solid rgba(99,102,241,0.4)",
              background: "rgba(99,102,241,0.08)", marginBottom: 28,
              fontSize: 13, fontWeight: 600, color: "#818cf8",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "pulse 2s infinite" }} />
              Academic Management System 2025
            </div>
            <h1 style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, marginBottom: 24 }}>
              <span style={{ color: "#fff" }}>Empowering </span><br/>
              <span style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Education
              </span>
              <br />
              <span style={{ color: "#fff" }}>Through </span>
              <span style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Innovation
              </span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "#94a3b8", maxWidth: 500, marginBottom: 40, lineHeight: 1.7 }}>
              A comprehensive college management portal for students, faculty, and administrators. Track marks, access study materials, and connect globally — all in one place.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={onLoginClick} style={{
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                border: "none", cursor: "pointer", padding: "14px 36px",
                borderRadius: 12, fontSize: 16, fontWeight: 700, color: "#fff",
                boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
                transition: "all 0.3s",
              }}>Get Started →</button>
              <button onClick={() => scrollTo("about")} style={{
                background: "transparent",
                border: "1px solid rgba(99,102,241,0.4)", cursor: "pointer", padding: "14px 36px",
                borderRadius: 12, fontSize: 16, fontWeight: 600, color: "#818cf8",
                transition: "all 0.3s",
              }}>Learn More</button>
            </div>
          </div>

          {/* Right Image Carousel */}
          <div style={{ position: "relative", height: 450, borderRadius: 24, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
            {slides.map((url, i) => (
              <img key={i} src={url} alt="Campus" style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover",
                opacity: currentSlide === i ? 1 : 0, transition: "opacity 1s ease-in-out", transform: currentSlide === i ? "scale(1)" : "scale(1.05)"
              }} />
            ))}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(15,23,42,0.8) 0%, transparent 50%)" }} />
            
            {/* Carousel Indicators */}
            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
              {slides.map((_, i) => (
                <div key={i} style={{
                  width: currentSlide === i ? 24 : 8, height: 8, borderRadius: 4,
                  background: currentSlide === i ? "#818cf8" : "rgba(255,255,255,0.4)",
                  transition: "all 0.3s ease", cursor: "pointer"
                }} onClick={() => setCurrentSlide(i)} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{ borderTop: "1px solid rgba(99,102,241,0.2)", borderBottom: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.02)", padding: "40px 0" }}>
        <div style={{ display: "flex", gap: "clamp(2rem, 5vw, 6rem)", justifyContent: "center", flexWrap: "wrap", maxWidth: 1200, margin: "0 auto" }}>
          {[{ val: 5000, suf: "+", label: "Students Enrolled" }, { val: 200, suf: "+", label: "Expert Faculty" }, { val: 50, suf: "+", label: "Departments" }, { val: 98, suf: "%", label: "Satisfaction Rate" }].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#818cf8", lineHeight: 1 }}>
                <Counter target={s.val} suffix={s.suf} />
              </div>
              <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" style={{ padding: "100px 2rem", background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase" }}>About Us</span>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, marginTop: 8, letterSpacing: -1 }}>
              Redefining College{" "}
              <span style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Management</span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 560, margin: "16px auto 0", lineHeight: 1.7 }}>
              We built EduPortal to eliminate paperwork, streamline communication, and bring every stakeholder of the institution onto one powerful platform.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
            {[
              { icon: "🎓", title: "Student-Centric Design", desc: "Students can view marks, download study materials, check timetables, and receive real-time notifications — all from their personalized dashboard." },
              { icon: "👨‍🏫", title: "Faculty Tools", desc: "Instructors upload marks, share study materials (PDFs & video links), manage student records, and send targeted notifications effortlessly." },
              { icon: "🛡️", title: "Secure & Role-Based", desc: "Three-tier access control ensures data privacy — each role (Student, Faculty, Admin) sees only what they need to." },
              { icon: "📧", title: "Automated Notifications", desc: "Welcome emails are sent instantly when accounts are created. Students are notified every time new study materials are uploaded." },
            ].map(card => (
              <div key={card.title} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.15)",
                borderRadius: 16, padding: 32, transition: "all 0.3s",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(99,102,241,0.4)"; e.currentTarget.style.background = "rgba(99,102,241,0.07)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(99,102,241,0.15)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: 36, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>{card.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 14 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Mission strip */}
          <div style={{
            marginTop: 60, padding: 40, borderRadius: 20,
            background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(124,58,237,0.08))",
            border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
          }}>
            <div style={{ fontSize: 48 }}>🏛️</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>Our Mission</h3>
              <p style={{ color: "#94a3b8", lineHeight: 1.7 }}>
                To provide every student, faculty member, and administrator with a seamless, modern, and intelligent academic experience that fosters growth, transparency, and excellence in education.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section id="services" style={{ padding: "100px 2rem", background: "#0f172a" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase" }}>Our Services</span>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, marginTop: 8, letterSpacing: -1 }}>
              Everything You Need,{" "}
              <span style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>In One Place</span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.7 }}>
              From marks management to study material distribution — EduPortal covers every aspect of modern college administration.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {[
              { icon: "📊", gradient: "linear-gradient(135deg,#6366f1,#4f46e5)", title: "Marks Management", desc: "Faculty upload internal assessment marks for students. Students can view detailed marks breakdowns anytime." },
              { icon: "📚", gradient: "linear-gradient(135deg,#059669,#0d9488)", title: "Study Materials", desc: "Upload PDF documents and YouTube/video links. Students get email notifications instantly when materials are added." },
              { icon: "🗓️", gradient: "linear-gradient(135deg,#d97706,#b45309)", title: "Timetable System", desc: "Manage and publish semester-wise timetables. Faculty and students access the latest schedule in real-time." },
              { icon: "📢", gradient: "linear-gradient(135deg,#dc2626,#b91c1c)", title: "Notice Board", desc: "Post important announcements, events, and circulars. Notifications reach the right audience instantly." },
              { icon: "👤", gradient: "linear-gradient(135deg,#7c3aed,#6d28d9)", title: "Profile Management", desc: "Students and faculty maintain rich academic profiles with photos, department info, and contact details." },
              { icon: "⚙️", gradient: "linear-gradient(135deg,#0284c7,#0369a1)", title: "Admin Dashboard", desc: "Centralized admin panel to manage students, faculty, branches, subjects, and system settings with ease." },
            ].map(svc => (
              <div key={svc.title} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 20, padding: 32, transition: "all 0.35s", cursor: "default", position: "relative", overflow: "hidden",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.border = "1px solid rgba(99,102,241,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)"; }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: svc.gradient, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 20,
                }}>{svc.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 10 }}>{svc.title}</h3>
                <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 14 }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── */}
      <section id="contact" style={{ padding: "100px 2rem", background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#818cf8", letterSpacing: 2, textTransform: "uppercase" }}>Contact Us</span>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, marginTop: 8, letterSpacing: -1 }}>
              Get In{" "}
              <span style={{ background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Touch</span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 480, margin: "16px auto 0", lineHeight: 1.7 }}>
              Have questions? Our team is here to help. Reach out and we'll get back to you within 24 hours.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 40, alignItems: "start" }}>
            {/* Info */}
            <div>
              {[
                { icon: "📍", title: "Address", info: "123 University Road, Knowledge City, India 400001" },
                { icon: "📞", title: "Phone", info: "+91 98765 43210" },
                { icon: "✉️", title: "Email", info: "info@eduportal.ac.in" },
                { icon: "🕒", title: "Office Hours", info: "Mon–Sat, 9:00 AM – 6:00 PM" },
              ].map(c => (
                <div key={c.title} style={{ display: "flex", gap: 16, marginBottom: 28 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ color: "#818cf8", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{c.title}</div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>{c.info}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleContact} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: 20, padding: 36,
            }}>
              {formSent && (
                <div style={{
                  background: "rgba(5,150,105,0.15)", border: "1px solid rgba(5,150,105,0.3)",
                  borderRadius: 10, padding: "12px 20px", marginBottom: 20, color: "#6ee7b7", fontSize: 14,
                }}>✅ Message sent! We'll respond within 24 hours.</div>
              )}
              {[
                { id: "contact-name", label: "Your Name", type: "text", key: "name" },
                { id: "contact-email", label: "Email Address", type: "email", key: "email" },
              ].map(f => (
                <div key={f.id} style={{ marginBottom: 20 }}>
                  <label htmlFor={f.id} style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{f.label}</label>
                  <input
                    id={f.id} type={f.type} required
                    value={formData[f.key]}
                    onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                    style={{
                      width: "100%", padding: "12px 16px", borderRadius: 10, outline: "none",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                      color: "#e2e8f0", fontSize: 14, boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 20 }}>
                <label htmlFor="contact-message" style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Message</label>
                <textarea
                  id="contact-message" rows={4} required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: "100%", padding: "12px 16px", borderRadius: 10, outline: "none",
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(99,102,241,0.2)",
                    color: "#e2e8f0", fontSize: 14, boxSizing: "border-box", resize: "vertical",
                  }}
                />
              </div>
              <button type="submit" style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                color: "#fff", fontSize: 15, fontWeight: 700,
                boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
              }}>Send Message ✉️</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(99,102,241,0.15)",
        background: "#0a0f1e", padding: "40px 2rem",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>E</div>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8" }}>EduPortal</span>
          </div>
          <p style={{ color: "#475569", fontSize: 13 }}>© 2025 EduPortal College. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {navLinks.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: 13 }}>{l.label}</button>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { scroll-behavior: smooth; }
        input::placeholder, textarea::placeholder { color: #475569; }
        input:focus, textarea:focus { border-color: rgba(99,102,241,0.5) !important; }
      `}</style>
    </div>
  );
};

export default LandingPage;
