import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    deadline: '',
    assignedTo: ''
  });
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: user.token }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: user.token }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    if (user.user.role === 'Admin') fetchUsers();
  }, [user]);

  const handleChange = e => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask, {
        headers: { Authorization: user.token }
      });
      setNewTask({ title: '', description: '', priority: 'Medium', status: 'To Do', deadline: '', assignedTo: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentChange = (id, value) => {
    setCommentInputs({ ...commentInputs, [id]: value });
  };

  const addComment = async (taskId) => {
    try {
      const newComment = {
        text: commentInputs[taskId],
        user: user.user._id
      };
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        $push: { comments: newComment }
      }, {
        headers: { Authorization: user.token }
      });
      setCommentInputs({ ...commentInputs, [taskId]: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const taskStats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    byUser: {}
  };
  tasks.forEach(t => {
    if (t.assignedTo?.name) {
      taskStats.byUser[t.assignedTo.name] = (taskStats.byUser[t.assignedTo.name] || 0) + 1;
    }
  });

  return (
   <div className="p-6 min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white">
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">Zidio Task Manager</h1>
    <button
      onClick={() => { logout(); navigate('/login'); }}
      className="bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white px-5 py-2 rounded-lg shadow-md"
    >
      Logout
    </button>
  </div>

  {(user.user.role === 'Admin' || user.user.role === 'Editor') && (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black p-7 rounded-xl shadow-xl mb-10 max-w-xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Create New Task</h2>
      
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

      <select
        name="priority"
        value={newTask.priority}
        onChange={handleChange}
        className="block w-full p-3 mb-4 border border-purple-300 rounded-lg text-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
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
        className="block w-full p-3 mb-5 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
      />

      {user.user.role === 'Admin' && (
        <select
          name="assignedTo"
          value={newTask.assignedTo}
          onChange={handleChange}
          required
          className="block w-full p-3 mb-6 border border-purple-300 rounded-lg text-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
        >
          <option value="">-- Assign to --</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>
              {u.name} ({u.role})
            </option>
          ))}
        </select>
      )}

      {user.user.role === 'Editor' && <input type="hidden" name="assignedTo" value={user.user._id} />}

      <button
        type="submit"
        className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg shadow-lg transition"
      >
        Create Task
      </button>
    </form>
  )}

  <div className="mb-10 max-w-xl mx-auto bg-white bg-opacity-90 text-black p-6 rounded-xl shadow-lg">
    <h3 className="text-2xl font-bold mb-4 text-purple-700">📊 Analytics</h3>
    <p className="mb-2">Total Tasks: <span className="font-semibold">{taskStats.total}</span></p>
    <p className="mb-2">Completed Tasks: <span className="font-semibold">{taskStats.done}</span></p>
    <ul className="list-disc list-inside text-sm">
      {Object.entries(taskStats.byUser).map(([name, count]) => (
        <li key={name}>
          <span className="font-medium">{name}</span>: {count} task(s)
        </li>
      ))}
    </ul>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {['To Do', 'In Progress', 'Done'].map(status => (
      <div key={status} className="bg-white text-black rounded-xl p-6 shadow-2xl hover:shadow-purple-400 transition-shadow">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-800">{status}</h2>
        {tasks.filter(t => t.status === status).map(task => (
          <div
            key={task._id}
            className="bg-purple-50 p-4 mb-4 rounded-lg shadow-md hover:bg-purple-100 transition-colors"
          >
            <h3 className="font-extrabold text-lg text-purple-900">{task.title}</h3>
            <p className="text-gray-700 text-sm mb-1">{task.description}</p>
            <p className="text-sm mb-1">
              Priority:{' '}
              <span className={`font-semibold ${
                task.priority === 'High' ? 'text-red-600' :
                task.priority === 'Medium' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {task.priority}
              </span>
            </p>
            <p className="text-sm mb-1">Deadline: {task.deadline?.slice(0, 10)}</p>
            <p className="text-sm mb-3">
              Assigned To: <span className="font-medium">{task.assignedTo?.name || '—'}</span>
            </p>

            <div>
              <h4 className="text-sm font-semibold mb-1">Comments:</h4>
              {task.comments?.map((c, idx) => (
                <p key={idx} className="text-xs border-l-4 pl-2 border-blue-400 italic mb-1">- {c.text}</p>
              ))}
              <input
                type="text"
                value={commentInputs[task._id] || ''}
                onChange={(e) => handleCommentChange(task._id, e.target.value)}
                placeholder="Add comment"
                className="w-full p-2 border border-purple-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              />
              <button
                onClick={() => addComment(task._id)}
                className="mt-2 text-xs bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded shadow transition"
              >
                Add
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