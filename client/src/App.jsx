


import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import MyApplication from "./pages/MyApplication";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StudentNotice from "./pages/notice";

const App = () => {
  const location = useLocation();

  // ❌ Hide navbar & footer on "/" and "/login"
  const hideLayout =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Navbar />}

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/applications" element={<MyApplication />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notice" element={<StudentNotice />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
