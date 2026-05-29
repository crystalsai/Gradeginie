import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { FiUpload, FiLink, FiVideo, FiFileText } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { baseApiURL } from "../../baseUrl";

const Material = () => {
  const { fullname } = useSelector((state) => state.userData);
  const [subject, setSubject] = useState();
  const [file, setFile] = useState();
  const [selected, setSelected] = useState({
    title: "",
    subject: "",
    faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
    materialType: "pdf",
    videoLink: "",
  });
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = useCallback(() => {
    const facultyName = fullname.split(" ")[0] + " " + fullname.split(" ")[2];
    axios
      .post(`${baseApiURL()}/material/getMaterial`, { faculty: facultyName })
      .then((res) => {
        if (res.data.success) {
          setMaterials(res.data.material);
        }
      })
      .catch((err) => console.error(err));
  }, [fullname]);

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

    fetchMaterials();
  }, [fetchMaterials]);

  const addMaterialHandler = () => {
    if (!selected.title || !selected.subject || selected.subject === "select") {
      return toast.error("Please fill title and subject");
    }
    if (selected.materialType === "pdf" && !file) {
      return toast.error("Please upload a PDF file");
    }
    if (selected.materialType === "video" && !selected.videoLink) {
      return toast.error("Please provide a video link");
    }

    toast.loading("Adding Material");
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    formData.append("title", selected.title);
    formData.append("subject", selected.subject);
    formData.append("faculty", selected.faculty);
    formData.append("type", "material");
    formData.append("materialType", selected.materialType);
    
    if (selected.materialType === "video") {
      formData.append("videoLink", selected.videoLink);
    } else {
      formData.append("material", file);
    }

    axios
      .post(`${baseApiURL()}/material/addMaterial`, formData, {
        headers: headers,
      })
      .then((response) => {
        toast.dismiss();
        if (response.data.success) {
          toast.success(response.data.message);
          setSelected({
            title: "",
            subject: "",
            faculty: fullname.split(" ")[0] + " " + fullname.split(" ")[2],
            materialType: "pdf",
            videoLink: "",
          });
          setFile("");
          fetchMaterials();
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.response?.data?.message || "Failed to add material");
      });
  };

  const deleteMaterial = (id) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      axios.delete(`${baseApiURL()}/material/deleteMaterial/${id}`)
        .then(res => {
          if (res.data.success) {
            toast.success("Material deleted successfully");
            fetchMaterials();
          }
        })
        .catch(err => {
          console.error(err);
          toast.error("Failed to delete material");
        });
    }
  };

  return (
    <div style={{ width: "100%", margin: "10px auto", display: "flex", flexDirection: "column", fontFamily: "'Inter','Poppins',sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", letterSpacing: -0.5 }}>
          Study Material <span style={{ color: "#6366f1" }}>Management</span>
        </h2>
      </div>

      <div style={{ display: "flex", gap: "24px", flexDirection: "column" }}>
        {/* Upload Form */}
        <div style={{
          background: "#f8fafc", border: "1px solid #e2e8f0",
          borderRadius: 16, padding: 32, width: "100%",
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#334155", marginBottom: 20 }}>Upload New Material</h3>
          
          {/* Type Selector */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24, background: "#e2e8f0", borderRadius: 12, padding: 6, maxWidth: 400 }}>
            {[
              { id: "pdf", icon: <FiFileText />, label: "PDF Document" },
              { id: "video", icon: <FiVideo />, label: "Video Link" }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelected({ ...selected, materialType: type.id })}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: 8, border: "none",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  background: selected.materialType === type.id ? "#fff" : "transparent",
                  color: selected.materialType === type.id ? "#6366f1" : "#64748b",
                  boxShadow: selected.materialType === type.id ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.25s",
                }}
              >
                {type.icon} {type.label}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label htmlFor="title" style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Material Title</label>
              <input
                type="text"
                id="title"
                placeholder="e.g. Chapter 1: Introduction"
                value={selected.title}
                onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12, outline: "none",
                  background: "#fff", border: "1px solid #cbd5e1",
                  color: "#0f172a", fontSize: 14, boxSizing: "border-box", transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#cbd5e1"}
              />
            </div>

            <div>
              <label htmlFor="subject" style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Material Subject</label>
              <select
                value={selected.subject}
                id="subject"
                onChange={(e) => setSelected({ ...selected, subject: e.target.value })}
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12, outline: "none",
                  background: "#fff", border: "1px solid #cbd5e1",
                  color: "#0f172a", fontSize: 14, boxSizing: "border-box", transition: "border-color 0.2s"
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#cbd5e1"}
              >
                <option value="select">-- Select Subject --</option>
                {subject && subject.map((item) => (
                  <option value={item.name} key={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Input based on Type */}
          {selected.materialType === "pdf" ? (
            <div style={{ marginTop: 20 }}>
              <label style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Upload PDF</label>
              {!file ? (
                <label
                  htmlFor="upload"
                  style={{
                    display: "flex", justifyContent: "center", alignItems: "center", gap: 10,
                    width: "100%", padding: "16px", borderRadius: 12, cursor: "pointer",
                    background: "#eef2ff", border: "1px dashed #818cf8",
                    color: "#6366f1", fontSize: 15, fontWeight: 600, transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#e0e7ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#eef2ff"; }}
                >
                  <FiUpload size={20} /> Select PDF File
                </label>
              ) : (
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  width: "100%", padding: "14px 16px", borderRadius: 12, boxSizing: "border-box",
                  background: "#ecfdf5", border: "1px solid #34d399",
                  color: "#059669", fontSize: 14, fontWeight: 500
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}><FiFileText /> {file.name}</span>
                  <button
                    onClick={() => setFile("")}
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex" }}
                  >
                    <AiOutlineClose size={18} />
                  </button>
                </div>
              )}
              <input
                type="file"
                id="upload"
                accept=".pdf"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div style={{ marginTop: 20 }}>
              <label htmlFor="videoLink" style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>YouTube / Video Link</label>
              <div style={{ position: "relative" }}>
                <FiLink style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#94a3b8", fontSize: 16, pointerEvents: "none" }} />
                <input
                  type="url"
                  id="videoLink"
                  placeholder="https://youtube.com/..."
                  value={selected.videoLink}
                  onChange={(e) => setSelected({ ...selected, videoLink: e.target.value })}
                  style={{
                    width: "100%", padding: "14px 16px 14px 44px", borderRadius: 12, outline: "none",
                    background: "#fff", border: "1px solid #cbd5e1",
                    color: "#0f172a", fontSize: 14, boxSizing: "border-box", transition: "border-color 0.2s"
                  }}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#cbd5e1"}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={addMaterialHandler}
              style={{
                padding: "12px 32px", borderRadius: 12, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                color: "#fff", fontSize: 15, fontWeight: 600,
                boxShadow: "0 4px 15px rgba(99,102,241,0.3)", transition: "all 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(99,102,241,0.4)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 15px rgba(99,102,241,0.3)"}
            >
              Publish Material
            </button>
          </div>
        </div>

        {/* Existing Materials List */}
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#334155", marginBottom: 16 }}>Your Uploaded Materials</h3>
          {materials.length === 0 ? (
            <div style={{ padding: "30px", background: "#f8fafc", borderRadius: 16, textAlign: "center", color: "#64748b", border: "1px dashed #cbd5e1" }}>
              No materials uploaded yet.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {materials.map((mat) => (
                <div key={mat._id} style={{
                  background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      background: mat.materialType === "video" ? "#fef2f2" : "#eef2ff",
                      color: mat.materialType === "video" ? "#ef4444" : "#6366f1", fontSize: 20
                    }}>
                      {mat.materialType === "video" ? <FiVideo /> : <FiFileText />}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, background: "#f1f5f9", padding: "4px 8px", borderRadius: 6, color: "#64748b" }}>
                      {mat.subject}
                    </span>
                  </div>
                  
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 6px", lineHeight: 1.4 }}>{mat.title}</h4>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, marginBottom: 16 }}>
                    {new Date(mat.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div style={{ marginTop: "auto", display: "flex", gap: 10 }}>
                    {mat.materialType === "video" ? (
                      <a href={mat.videoLink} target="_blank" rel="noreferrer" style={{
                        flex: 1, padding: "8px", background: "#f8fafc", color: "#334155", textAlign: "center",
                        borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #e2e8f0"
                      }}>Watch</a>
                    ) : (
                      <a href={`${process.env.REACT_APP_MEDIA_LINK}/${mat.link}`} target="_blank" rel="noreferrer" style={{
                        flex: 1, padding: "8px", background: "#f8fafc", color: "#334155", textAlign: "center",
                        borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #e2e8f0"
                      }}>View PDF</a>
                    )}
                    <button onClick={() => deleteMaterial(mat._id)} style={{
                      padding: "8px 12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2",
                      borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background 0.2s"
                    }} onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"} onMouseLeave={e => e.currentTarget.style.background = "#fef2f2"}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Material;
