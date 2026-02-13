import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
    localStorage.clear(); // clears token + student
    navigate("/", { replace: true });
  };


  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-sm font-medium transition
     ${isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"}`;

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div
            className="text-xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Smart Campus
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/companies" className={linkClass}>Companies</NavLink>
            <NavLink to="/applications" className={linkClass}>My Applications</NavLink>
            <NavLink to="/notice" className={linkClass}>Notice</NavLink>
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>

            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 cursor-pointer text-white rounded-md text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="px-4 py-3 space-y-2">
            <NavLink onClick={() => setIsOpen(false)} to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/companies" className={linkClass}>
              Companies
            </NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/applications" className={linkClass}>
              My Applications
            </NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/notice" className={linkClass}>
             Notice
            </NavLink>
            <NavLink onClick={() => setIsOpen(false)} to="/profile" className={linkClass}>
              Profile
            </NavLink>

            <button
              onClick={handleLogout}
              className="w-full mt-3 px-4 py-2 cursor-pointer bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
