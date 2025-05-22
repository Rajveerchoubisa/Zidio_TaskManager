import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "To Do",
    deadline: "",
    assignedTo: "",
  });
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: user.token },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch users (only for Admin)
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: user.token },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user.user.role === "Admin") fetchUsers();
  }, [user]);

  // Handle input changes for new task form
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Submit new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/tasks", newTask, {
        headers: { Authorization: user.token },
      });
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        status: "To Do",
        deadline: "",
        assignedTo: "",
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle comment input change
  const handleCommentChange = (id, value) => {
    setCommentInputs({ ...commentInputs, [id]: value });
  };

  // Add comment to task
  const addComment = async (taskId) => {
    try {
      const newComment = {
        text: commentInputs[taskId],
        user: user.user._id,
      };
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { $push: { comments: newComment } },
        { headers: { Authorization: user.token } }
      );
      setCommentInputs({ ...commentInputs, [taskId]: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Update task status function
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: user.token } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };
const deleteTask = async (taskId) => {
  // const token =  localStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to delete task');
    }

    console.log('Task deleted:', data.msg);
    // Update UI or state accordingly
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  } catch (error) {
    console.error('Failed to delete task:', error.message);
  }
};


  // Task stats calculation
  const taskStats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "Done").length,
    byUser: {},
  };
  tasks.forEach((t) => {
    if (t.assignedTo?.name) {
      taskStats.byUser[t.assignedTo.name] =
        (taskStats.byUser[t.assignedTo.name] || 0) + 1;
    }
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">
          Zidio Task Manager
        </h1>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white px-5 py-2 rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>

      {(user.user.role === "Admin" || user.user.role === "Editor") && (
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-7 rounded-xl shadow-xl mb-10 max-w-xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
            Create New Task
          </h2>

          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="block w-full p-3 mb-4 border border-purple-300 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />

          <textarea
            name="description"
            value={newTask.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="block w-full p-3 mb-4 border border-purple-300 rounded-lg placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleChange}
              className="w-full p-3 border border-purple-300 rounded-lg text-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <input
              type="date"
              name="deadline"
              value={newTask.deadline}
              onChange={handleChange}
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            />

            {user.user.role === "Admin" ? (
              <select
                name="assignedTo"
                value={newTask.assignedTo}
                onChange={handleChange}
                required
                className="w-full p-3 border border-purple-300 rounded-lg text-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              >
                <option value="">-- Assign to --</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            ) : (
              <input type="hidden" name="assignedTo" value={user.user._id} />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-lg transition"
          >
            Create Task
          </button>
        </form>
      )}

      <div className="mb-10 max-w-xl mx-auto bg-white bg-opacity-90 text-black p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-purple-700">
          📊 Analytics
        </h3>
        <p className="mb-2">
          Total Tasks: <span className="font-semibold">{taskStats.total}</span>
        </p>
        <p className="mb-2">
          Completed Tasks:{" "}
          <span className="font-semibold">{taskStats.done}</span>
        </p>
        <ul className="list-disc list-inside text-sm">
          {Object.entries(taskStats.byUser).map(([name, count]) => (
            <li key={name}>
              <span className="font-medium">{name}</span>: {count} task(s)
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {["To Do", "In Progress", "Done"].map((status) => (
          <div
            key={status}
            className="bg-white text-black rounded-xl p-6 shadow-2xl hover:shadow-purple-400 transition-shadow"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">
              {status}
            </h2>
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-purple-50 p-4 mb-4 rounded-lg shadow-md hover:bg-purple-100 transition-colors"
                >
                  <h3 className="font-extrabold text-lg text-purple-900">
                    {task.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-1">
                    {task.description}
                  </p>
                  <p className="text-sm mb-1">
                    Priority:{" "}
                    <span
                      className={`font-semibold ${
                        task.priority === "High"
                          ? "text-red-600"
                          : task.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </p>
                  <p className="text-sm mb-1">
                    Deadline: {task.deadline?.slice(0, 10)}
                  </p>
                  <p className="text-sm mb-3">
                    Assigned To:{" "}
                    <span className="font-medium">
                      {task.assignedTo?.name || "—"}
                    </span>
                  </p>

                  {/* Status update buttons */}
                  {(user.user.role === "Admin" ||
                    user.user.role === "Editor") && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.status !== "To Do" && (
                        <button
                          onClick={() => updateTaskStatus(task._id, "To Do")}
                          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-xs rounded"
                        >
                          Move to To Do
                        </button>
                      )}
                      {task.status !== "In Progress" && (
                        <button
                          onClick={() =>
                            updateTaskStatus(task._id, "In Progress")
                          }
                          className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-xs rounded"
                        >
                          Move to In Progress
                        </button>
                      )}
                      {task.status !== "Done" && (
                        <button
                          onClick={() => updateTaskStatus(task._id, "Done")}
                          className="px-3 py-1 bg-green-200 hover:bg-green-300 text-xs rounded"
                        >
                          Move to Done
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this task?"
                        )
                      ) {
                        deleteTask(task._id);
                      }
                    }}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded ml-auto"
                  >
                    Delete
                  </button>

                  {/* Comments section */}
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-purple-700">
                      Comments:
                    </h4>
                    <ul className="max-h-32 overflow-auto mb-3 space-y-1 text-sm">
                      {(task.comments || []).map((c, i) => (
                        <li key={i} className="border-b border-purple-200 pb-1">
                          <strong>{c.user?.name || "Unknown"}:</strong> {c.text}
                        </li>
                      ))}
                    </ul>
                    <textarea
                      value={commentInputs[task._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(task._id, e.target.value)
                      }
                      placeholder="Add a comment..."
                      className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={2}
                    />
                    <button
                      onClick={() => addComment(task._id)}
                      disabled={
                        !commentInputs[task._id] ||
                        commentInputs[task._id].trim() === ""
                      }
                      className="mt-2 px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Comment
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
