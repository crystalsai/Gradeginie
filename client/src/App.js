import React, { useState } from "react";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import mystore from "./redux/store";
import StudentHome from "./Screens/Student/Home";
import FacultyHome from "./Screens/Faculty/Home";
import AdminHome from "./Screens/Admin/Home";

// Wrapper so LandingPage can trigger navigate to login
const LandingWrapper = () => {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <Login onBackToLanding={() => setShowLogin(false)} />;
  }
  return <LandingPage onLoginClick={() => setShowLogin(true)} />;
};

const App = () => {
  return (
    <>
      <Provider store={mystore}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingWrapper />} />
            <Route path="student" element={<StudentHome />} />
            <Route path="faculty" element={<FacultyHome />} />
            <Route path="admin" element={<AdminHome />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
};

export default App;
