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
  Card,
  CardContent,
  CardActions,
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
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, backgroundColor: "#f0f4f8" }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          📝 To-do List
        </Typography>

        <Card variant="outlined" sx={{ mb: 4, p: 2, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <TextField
                  label="Enter a Task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  onClick={addTask}
                  fullWidth
                  sx={{
                    height: "100%",
                    backgroundColor: "#4CAF50",
                    ":hover": { backgroundColor: "#45a049" },
                    color: "white",
                  }}
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {tasks.length > 0 && (
          <Container sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#e0e0e0" }}>
                <TableRow>
                  <TableCell><strong>Sl.No</strong></TableCell>
                  <TableCell><strong>Task</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((item, index) => (
                  <TableRow key={item.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.task}</TableCell>
                    <TableCell align="center">
                      <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => openEditModal(item.id, item.task)}
                            sx={{
                              backgroundColor: "#2196F3",
                              ":hover": { backgroundColor: "#1976D2" },
                              color: "white",
                            }}
                          >
                            Edit
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => deleteTask(item.id)}
                            sx={{
                              backgroundColor: "#f44336",
                              ":hover": { backgroundColor: "#d32f2f" },
                              color: "white",
                            }}
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
              width: isSmallScreen ? "90%" : 400,
              bgcolor: "#fff",
              p: 4,
              boxShadow: 24,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>Edit Task</Typography>
            <TextField
              fullWidth
              label="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              variant="outlined"
            />
            <Grid container spacing={2} mt={2}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={saveTask}
                  sx={{ backgroundColor: "#4CAF50", ":hover": { backgroundColor: "#388e3c" }, color: "white" }}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={closeModal}
                  sx={{ backgroundColor: "#9e9e9e", ":hover": { backgroundColor: "#757575" }, color: "white" }}
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
