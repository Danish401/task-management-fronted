import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logoutUser } from "./authSlice";
const API_BASE_URL = process.env.NODE_ENV === "production" 
  ? "https://task-qcm8.onrender.com" 
  : "http://localhost:5000";
   



// Async thunk for creating a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Use the token passed as an argument
        },
      };
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Async thunk for fetching all posts
export const getPosts = createAsyncThunk(
  "posts/getPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage if needed
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authenticated requests
        },
      };
      const response = await axios.get(`${API_BASE_URL}/api/posts/`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getPostsByUserId = createAsyncThunk(
  "posts/getPostsByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage if needed
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authenticated requests
        },
      };
      const response = await axios.get(
        `${API_BASE_URL}/api/posts/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// Post slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: { clearPostState: (state) => {
    state.posts = [];
    state.loading = false;
    state.error = null;
  },}, // Define additional reducers here if needed
  extraReducers: (builder) => {
    // Create post
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload); // Add the new post to the state
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get posts
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; // Replace posts with fetched data
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPostsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; // Replace posts with fetched data
      })
      .addCase(getPostsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }).addCase(logoutUser.fulfilled, (state) => {
        // Clear post-related state when logging out
        state.posts = [];
        state.loading = false;
        state.error = null;
      });
  },
});
export const { clearPostState } = postSlice.actions;
export default postSlice.reducer;
