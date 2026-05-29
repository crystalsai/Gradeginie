/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import Notice from "../../components/Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import { baseApiURL } from "../../baseUrl";
import Admin from "./Admin";
import Profile from "./Profile";
import Branch from "./Branch";
import CampusConnect from "../../components/CampusConnect";
import ContactMessages from "./ContactMessages";
import { FiUser, FiUsers, FiBookOpen, FiGitBranch, FiBell, FiShield, FiMessageSquare, FiMail } from "react-icons/fi";

const Home = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Profile");
  const [dashboardData, setDashboardData] = useState({
    studentCount: "",
    facultyCount: "",
  });

  useEffect(() => {
    if (router.state === null) {
      navigate("/");
    }
    setLoad(true);
  }, [navigate, router.state]);

  useEffect(() => {
    getStudentCount();
    getFacultyCount();
  }, []);

  const getStudentCount = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/student/details/count`, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.success) {
          setDashboardData({
            ...dashboardData,
            studentCount: response.data.user,
          });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getFacultyCount = () => {
    const headers = {
      "Content-Type": "application/json",
    };
    axios
      .get(`${baseApiURL()}/faculty/details/count`, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.success) {
          setDashboardData({
            ...dashboardData,
            facultyCount: response.data.user,
          });
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const menuItems = [
    { id: "Profile", icon: <FiUser />, label: "Profile" },
    { id: "Student", icon: <FiUsers />, label: "Students" },
    { id: "Faculty", icon: <FiUsers />, label: "Faculty" },
    { id: "Branch", icon: <FiGitBranch />, label: "Branches" },
    { id: "Notice", icon: <FiBell />, label: "Notices" },
    { id: "Subjects", icon: <FiBookOpen />, label: "Subjects" },
    { id: "Admin", icon: <FiShield />, label: "Admins" },
    { id: "Chat", icon: <FiMessageSquare />, label: "Campus Chat" },
    { id: "Contact", icon: <FiMail />, label: "Contact Msgs" },
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
                    background: selectedMenu === item.id ? "linear-gradient(135deg, #7c3aed, #9333ea)" : "rgba(255,255,255,0.05)",
                    color: selectedMenu === item.id ? "#fff" : "#94a3b8",
                    boxShadow: selectedMenu === item.id ? "0 4px 15px rgba(124,58,237,0.3)" : "none",
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
              {selectedMenu === "Branch" && <Branch />}
              {selectedMenu === "Notice" && <Notice />}
              {selectedMenu === "Student" && <Student />}
              {selectedMenu === "Faculty" && <Faculty />}
              {selectedMenu === "Subjects" && <Subjects />}
              {selectedMenu === "Admin" && <Admin />}
              {selectedMenu === "Profile" && <Profile />}
              {selectedMenu === "Chat" && <CampusConnect />}
              {selectedMenu === "Contact" && <ContactMessages />}
            </div>
          </div>
        </>
      )}
      <Toaster position="bottom-center" />
    </section>
  );
};

export default Home;
