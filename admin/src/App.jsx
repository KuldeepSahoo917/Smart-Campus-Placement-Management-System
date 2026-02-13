

import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import Applications from "./pages/Applications";

import Footer from "./components/Footer";
import Navbar from "./components/Navabr";
import Students from "./pages/Student";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Notise from "./pages/Notise";


const App = () => {
  const location = useLocation();

  // Hide Navbar & Footer on login page
  const hideLayout = location.pathname === "/login" || location.pathname === "/home";


  return (
    <>
      {!hideLayout && <Navbar />}
       <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* First page → Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<AdminLogin />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students/>} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/notice" element={<Notise/>} />
    
      </Routes>
       
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
