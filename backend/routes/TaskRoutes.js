import express from 'express';
import Task from '../models/TaskModels.js';
import { auth } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find()
  .populate('assignedTo', 'name role')
  .populate('comments.user', 'name')
  .populate('assignedTo').sort('-createdAt');
  res.json(tasks);
});

router.post('/', auth, async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.status(201).json(newTask);
});

router.put('/:id', auth, async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id',auth , async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Example authorization check: only Admin or assigned user can delete
    if (req.user.role !== 'Admin' && task.assignedTo.toString() !== req.user._id) {
      return res.status(403).json({ msg: 'Forbidden: Not allowed to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});


export default router;