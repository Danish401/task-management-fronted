import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { logoutUser } from "./authSlice"; // Import logout action if needed
// Update the URL based on your backend
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://task-management-ib2z.onrender.com"
    : "http://localhost:5000";

// Async Thunks for API Calls

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  "tasks/getAllTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An error occurred while fetching tasks."
      );
    }
  }
);

// Create a new task
// export const createTask = createAsyncThunk(
//   "tasks/createTask",
//   async ({ taskData, userId }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${API_BASE_URL}/tasks/`, {
//         ...taskData,
//         user: userId || undefined, // Include user ID if available
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message || "An error occurred while creating the task.");
//     }
//   }
// );
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async ({ taskData, userId }, { rejectWithValue, getState }) => {
    try {
      // Get the token from the Redux state or from localStorage if stored there
      const token = getState().auth.token || localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/api/tasks/`,
        {
          ...taskData,
          user: userId || undefined, // Include user ID if available
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include Bearer token in headers
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while creating the task."
      );
    }
  }
);
// Update task status
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/tasks/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while updating the task status."
      );
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/tasks/${id}`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while deleting the task."
      );
    }
  }
);

// Fetch task by ID
export const fetchTaskById = createAsyncThunk(
  "tasks/getTaskById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while fetching the task."
      );
    }
  }
);

// Update task details
export const updateTaskDetails = createAsyncThunk(
  "tasks/updateTaskDetails",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/tasks/data/${id}`,
        taskData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message ||
          "An error occurred while updating the task details."
      );
    }
  }
);
export const fetchTasksByUserId = createAsyncThunk(
  "tasks/getTasksByUserId",
  async (userId, { rejectWithValue, getState }) => {
    try {
      // Get the token from the Redux state or from localStorage if stored there
      const token = getState().auth.token || localStorage.getItem("token");

      // Include token in Authorization header
      const response = await axios.get(
        `${API_BASE_URL}/api/tasks/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token to the request headers
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching tasks by user ID."
      );
    }
  }
);

// Task Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    selectedTask: null,
  },
  reducers: {
    clearTaskState: (state) => {
      state.tasks = [];
      state.loading = false;
      state.error = null;
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update task status
      .addCase(updateTaskStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.id
        );
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTasksByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedTask = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update task details
      .addCase(updateTaskDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tasks.findIndex(
          (task) => task._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // Clear task-related state when logging out
        state.tasks = [];
        state.loading = false;
        state.error = null;
        state.selectedTask = null;
      });
  },
});
export const { clearTaskState } = taskSlice.actions;
export default taskSlice.reducer;
