import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Modal,
  Box,
  Grid,
  useMediaQuery,
  Typography,
  Paper,
  useTheme,
} from "@mui/material";
import axios from "axios";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/datas");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching todos!", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/datas", { task });
      setTasks([...tasks, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error creating todo!", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/datas/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting todo!", error);
    }
  };

  const openEditModal = (id, task) => {
    setEditId(id);
    setTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTask("");
    setEditId(null);
  };

  const saveTask = async () => {
    if (!task.trim()) return;

    try {
      await axios.put(`http://localhost:5000/datas/${editId}`, { task });
      setTasks(tasks.map((item) => (item.id === editId ? { ...item, task } : item)));
      closeModal();
    } catch (error) {
      console.error("Error updating task!", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: "10px" }}>
        <Typography variant="h4" align="center" gutterBottom>
          To-do List
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              label="Enter a Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1976d2", color: "white" }}
              onClick={addTask}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {tasks.length > 0 && (
          <Container sx={{ mt: 4, overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sl.No</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.task}</TableCell>
                    <TableCell>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6}>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "#ff9800", color: "white" }}
                            fullWidth
                            onClick={() => openEditModal(item.id, item.task)}
                          >
                            Edit
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            variant="contained"
                            sx={{ backgroundColor: "#d32f2f", color: "white" }}
                            fullWidth
                            onClick={() => deleteTask(item.id)}
                          >
                            Delete
                          </Button>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Container>
        )}

        <Modal open={isModalOpen} onClose={closeModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: isSmallScreen ? "85%" : 400,
              bgcolor: "background.paper",
              p: 3,
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Edit Task
            </Typography>
            <TextField
              fullWidth
              label="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#388e3c", color: "white" }}
                  fullWidth
                  onClick={saveTask}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#757575", color: "white" }}
                  fullWidth
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      </Paper>
    </Container>
  );
};

export default TodoList;
