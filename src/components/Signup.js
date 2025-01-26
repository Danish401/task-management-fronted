

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setUser, setLoading, setError } from "../redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "email" && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email address" }));
    } else if (name === "password" && !validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 6 characters, include a number, a letter, and a special character.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all fields!");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email address!");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must be at least 6 characters, include a number, a letter, and a special character."
      );
      return;
    }

    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        toast.success("Registration successful!");
        navigate("/");
      })
      .catch((err) => toast.error(err));
  };


  const handleGoogleSignup = () => {
    const googleLoginUrl ="https://task-management-ib2z.onrender.com/auth/google";
    const width = 500, height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
  
    const googleLoginWindow = window.open(
      googleLoginUrl,
      "Google Login",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  
    const pollTimer = window.setInterval(() => {
      if (googleLoginWindow.closed) {
        window.clearInterval(pollTimer);
        console.log("Google signup window closed");
      }
    }, 500);
    window.addEventListener(
      "message",
      (event) => {
        if (event.origin === "https://task-management-ib2z.onrender.com" && event.data.user) {
          const { user, token } = event.data;
          console.log("User data:", user);
          dispatch(setUser({ user, token }));
          toast.success("Google signup successful!");
          navigate("/");
        } else {
          console.warn("Message from unknown origin or invalid data");
        }
      },
      false
    );
    
  };
  

  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f4f4]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Signup</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#26a69a]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-[#26a69a]`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded focus:outline-none focus:ring-2 focus:ring-[#26a69a]`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-[#004d40] rounded hover:bg-[#00332d]"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </form>
        {error && <p className="mt-2 text-center text-red-500">{error}</p>}

        <div className="flex flex-col items-center mt-6">
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            <FcGoogle className="mr-2 text-xl" />
            Signup with Google
          </button>
          <p className="mt-4 text-sm">
            Already registered?{" "}
            <button
              onClick={() => navigate("/log-in")}
              className="text-[#26a69a] hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
