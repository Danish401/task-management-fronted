

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasksByUserId,
  createTask,
  deleteTask,
  fetchTaskById,
  updateTaskDetails,
} from "../redux/taskSlice";
import { MdOutlineAddTask } from "react-icons/md";
import {
  Box,
  Modal,
  Button,
  TextField,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import Swal from "sweetalert2";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const TaskManager = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user ? user._id : null;

  const [open, setOpen] = useState(false);
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    if (userId && isAuthenticated) {
      dispatch(fetchTasksByUserId(userId)).catch((err) => {
        if (err.response && err.response.status === 401) {
          console.log("Unauthorized access, please log in");
        } else {
          console.error(err);
        }
      });
    }
  }, [dispatch, userId, isAuthenticated]);

  const handleOpen = () => {
    if (isAuthenticated) {
      setOpen(true);
    } else {
      Swal.fire({
        title: "Please Login",
        text: "You need to be logged in to add tasks.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#5B5BD6",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTaskData({ name: "", description: "", status: "Pending" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (taskData.name.trim() && taskData.description.trim()) {
      if (taskData._id) {
        dispatch(updateTaskDetails({ id: taskData._id, taskData }));
      } else {
        dispatch(createTask({ taskData, userId }));
      }
      handleClose();
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#009688",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTask(id));
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  const handleEdit = async (task) => {
    try {
      const response = await dispatch(fetchTaskById(task._id)).unwrap();
      setTaskData(response);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch task details:", error);
    }
  };

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      {/* Add Task Button */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<MdOutlineAddTask />}
          onClick={handleOpen}
          sx={{
            backgroundColor: "#5B5BD6",
            ":hover": { backgroundColor: "#4A4AD4" },
          }}
        >
          Add Task
        </Button>
      </Box>
      {/* Tasks Grid */}
      <Grid container spacing={3}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} key={task._id}>
              <Card variant="outlined" sx={{ boxShadow: 3, padding: 2 }}>
                <CardContent sx={{ textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#5B5BD6", marginBottom: 1 }}
                  >
                    Task: {task.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginBottom: 1, color: "#4A4A4A" }}
                  >
                    Description: {task.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ color: "#00897b" }}
                  >
                    Status: {task.status}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <IconButton sx={{ color: "#00897b" }} onClick={() => handleEdit(task)}>
                    <EditNoteIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(task._id)}>
                    <DeleteSweepIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No tasks available.
          </Typography>
        )}
      </Grid>

      {/* Add/Edit Task Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            {taskData._id ? "Edit Task" : "Add Task"}
          </Typography>
          <TextField
            label="Task Name"
            name="name"
            fullWidth
            margin="normal"
            value={taskData.name}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={taskData.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={taskData.status}
              onChange={handleChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Button onClick={handleClose} variant="outlined" sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                backgroundColor: "#5B5BD6",
                ":hover": { backgroundColor: "#4A4AD4" },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TaskManager;
