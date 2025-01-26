import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {clearPostState} from "./postSlice"
import { clearTaskState } from "./taskSlice";
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://task-qcm8.onrender.com"
    : "http://localhost:5000";

// Thunks for async API calls
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        userData
      );
      return response.data; // { user, token }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        credentials
      );
      return response.data; // { user, token }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/logout`);
      dispatch(clearTaskState()); // Clear tasks
      dispatch(clearPostState()); // Clear posts
      return response.data; // { message: "Logout successful" }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false, // Derived property
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false; // Update isAuthenticated
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.clear(); // Clears all localStorage data
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true; // Update isAuthenticated
      localStorage.setItem("authToken", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // Update isAuthenticated
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login success:", action.payload); // Log the response payload
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }).addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      }).addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to logout";
      });
  },
});

// Export actions and reducer
export const { setUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
