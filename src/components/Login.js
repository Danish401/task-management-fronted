import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, setUser } from "../redux/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FcGoogle } from "react-icons/fc"; // For Google Icon

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill all fields!");
      return;
    }
    if (!emailPattern.test(credentials.email)) {
      toast.error("Please enter a valid email!");
      return;
    }
    if (credentials.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    dispatch(loginUser(credentials))
      .unwrap()
      .then(() => {
        toast.success("Login successful!");
        navigate("/"); // Navigate to /dashboard after login
      })
      .catch((err) => {
        // If the user is not registered
        toast.error("Please register first! You're not registered yet.");
      });
  };

  const handleGoogleLogin = () => {
    const googleLoginUrl = "https://task-management-ib2z.onrender.com/auth/google";
    const width = 500,
      height = 600;
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
        if (
          event.origin === "https://task-management-ib2z.onrender.com" &&
          event.data.user
        ) {
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
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Login</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-[#004d40] rounded"
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
      {error && <p className="mt-2 text-center text-red-500">{error}</p>}

      {/* Google Login Button */}
      <div className="flex flex-col items-center mt-6">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          <FcGoogle className="mr-2 text-xl" />
          Login with Google
        </button>
      </div>

      {/* Signup Link */}
      <div className="flex justify-center mt-4 text-sm">
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/sign-up")}
            className="text-[#26a69a] hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
