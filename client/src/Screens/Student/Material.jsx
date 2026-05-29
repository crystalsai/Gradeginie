import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoMdLink } from "react-icons/io";
import { HiOutlineCalendar, HiOutlineSearch } from "react-icons/hi";
import { FiVideo, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import { baseApiURL } from "../../baseUrl";

const Material = () => {
  const [subject, setSubject] = useState();
  const [selected, setSelected] = useState("");
  const [material, setMaterial] = useState([]);

  useEffect(() => {
    toast.loading("Loading Subjects");
    axios
      .get(`${baseApiURL()}/subject/getSubject`)
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          setSubject(response.data.subject);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.message);
      });
  }, []);

  const getSubjectMaterial = () => {
    if (!selected || selected === "select") {
      return toast.error("Please select a subject first");
    }
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .post(
        `${baseApiURL()}/material/getMaterial`,
        { subject: selected },
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          setMaterial(response.data.material);
        } else {
          toast.error("Failed to load materials");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onSelectChangeHandler = (e) => {
    setMaterial([]);
    setSelected(e.target.value);
  };

  const handleOpenMaterial = (item) => {
    if (item.materialType === "video") {
      window.open(item.videoLink, "_blank");
    } else {
      window.open(process.env.REACT_APP_MEDIA_LINK + "/" + item.link, "_blank");
    }
  };

  return (
    <div style={{ width: "100%", margin: "20px auto 40px", display: "flex", flexDirection: "column", fontFamily: "'Inter','Poppins',sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", letterSpacing: -0.5 }}>
          Study <span style={{ color: "#6366f1" }}>Materials</span>
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        
        {/* Search Bar */}
        <div style={{ display: "flex", width: "100%", maxWidth: 500, gap: 12, marginBottom: 40 }}>
          <select
            value={selected}
            onChange={onSelectChangeHandler}
            style={{
              flex: 1, padding: "14px 16px", borderRadius: 12, outline: "none",
              background: "#f8fafc", border: "1px solid #e2e8f0",
              color: "#334155", fontSize: 15, fontWeight: 500,
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
            }}
          >
            <option value="select">-- Select Subject --</option>
            {subject && subject.map((item) => (
              <option value={item.name} key={item.name}>{item.name}</option>
            ))}
          </select>
          <button
            onClick={getSubjectMaterial}
            style={{
              padding: "0 24px", borderRadius: 12, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #6366f1, #7c3aed)",
              color: "#fff", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 15px rgba(99,102,241,0.3)"
            }}
          >
            <HiOutlineSearch />
          </button>
        </div>

        {/* Results Grid */}
        <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
          {material && material.slice().reverse().map((item, index) => {
            const date = new Date(item.createdAt);
            const isVideo = item.materialType === "video";
            
            return (
              <div
                key={index}
                style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(99,102,241,0.12)"; e.currentTarget.style.borderColor = "#818cf8"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)"; e.currentTarget.style.borderColor = "#e2e8f0"; }}
                onClick={() => handleOpenMaterial(item)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    background: isVideo ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                    color: isVideo ? "#ef4444" : "#10b981"
                  }}>
                    {isVideo ? <FiVideo /> : <FiFileText />}
                  </div>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#64748b",
                    background: "#f1f5f9", padding: "4px 10px", borderRadius: 20
                  }}>
                    <HiOutlineCalendar />
                    {date.toLocaleDateString('en-GB')}
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginBottom: 6, lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                
                <p style={{ color: "#64748b", fontSize: 13, display: "flex", flexDirection: "column", gap: 4, marginTop: "auto" }}>
                  <span><strong style={{ color: "#475569" }}>Subject:</strong> {item.subject}</span>
                  <span><strong style={{ color: "#475569" }}>By:</strong> {item.faculty}</span>
                </p>

                <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", color: "#6366f1", fontSize: 13, fontWeight: 600 }}>
                  {isVideo ? "Watch Video" : "Download PDF"} <IoMdLink size={16} style={{ marginLeft: 6 }} />
                </div>
              </div>
            );
          })}
        </div>

        {material && material.length === 0 && selected && selected !== "select" && (
          <div style={{ textAlign: "center", padding: "40px", color: "#64748b", background: "#f8fafc", borderRadius: 16, width: "100%" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No materials found for this subject.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Material;
