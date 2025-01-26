import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  setUser,logoutUser } from "../redux/authSlice";
import { toast } from "react-toastify";
import { Box, IconButton } from "@mui/material";
import { FaBars } from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { FaUser } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { SiSparkpost } from "react-icons/si";
import { RiDragDropFill } from "react-icons/ri";
import axios from "axios";
import Footer from "./Footer"; // Import Footer
const navLinks = [
  { path: "/", label: "Home", icon: <TbLayoutDashboardFilled /> },
  { path: "/add-task", label: "Add Task", icon: <PlaylistAddIcon /> },
  { path: "/task-drag", label: "Drag & Drop", icon: <RiDragDropFill /> },
  { path: "/post", label: "Post", icon: <SiSparkpost /> },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getUser = async () => {
    try {
      const { data } = await axios.get("https://task-management-ib2z.onrender.com/auth/login/success", {
        withCredentials: true,
      });
      dispatch(setUser(data.user._json));
    } catch (err) {
      toast.error("Failed to fetch user data.");
    }
  };

  useEffect(() => {
    if (token && !user) getUser();
  }, [token, user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/log-in");
  };

  return (
    <Box>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#e8f5e9] text-[#fffff] flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="items-center hidden space-x-6 md:flex">
         
          <nav className="flex space-x-6">
            {navLinks.map(({ path, label, icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 hover:underline ${
                  location.pathname === path ? "text-[#26a69a]" : ""
                }`}
              >
                {icon} <span>{label}</span>
              </Link>
            ))}
          </nav>
          {user && (
            <div className="flex flex-col text-sm text-right">
              <span className="font-semibold">{user.name}</span>
              <span>{user.email}</span>
            </div>
          )}
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-2 rounded-md transition-colors duration-300 hover:bg-[#00796b]"
            >
              <AiOutlineLogout className="text-lg sm:text-xl" />
              <span>Logout</span>
            </button>
          ) : (
            <Link
              to="/sign-up"
              className="flex items-center space-x-3 px-4 py-2 rounded-md transition-colors duration-300 hover:bg-[#00796b]"
            >
              <FaUser className="text-lg sm:text-xl" />
              <span>Sign Up</span>
            </Link>
          )}
        </div>
        <div className="md:hidden">
          <IconButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FaBars />
          </IconButton>
        </div>
      </header>

      {isMobileMenuOpen && (
        <nav className="md:hidden bg-[#004d40] text-white flex flex-col p-4 mt-16">
         
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`py-2 hover:underline ${
                location.pathname === path ? "text-[#26a69a]" : ""
              }`}
            >
              {label}
            </Link>
          ))}
           {user && (
            <div className="mb-4 text-sm">
              <div className="font-semibold">{user.name}</div>
              <div>{user.email}</div>
            </div>
          )}
          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="py-2 mt-2 text-left hover:bg-[#00796b] rounded-md"
            >
              <AiOutlineLogout className="inline mr-2" />
              Logout
            </button>
          ) : (
            <Link
              to="/sign-up"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 mt-2 hover:bg-[#00796b] rounded-md"
            >
              <FaUser className="inline mr-2" />
              Sign Up
            </Link>
          )}
          
        </nav>
      )}
   
      <main className="pt-20 p-6 bg-[#F8F9FA] min-h-screen">
        
        <Outlet />
      </main>
      <Footer/>
    </Box>
  );
}
