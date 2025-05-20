import express from 'express';
import Task from '../models/TaskModels.js';
import { auth } from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const tasks = await Task.find().populate('assignedTo').sort('-createdAt');
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

router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Task deleted' });
});

export default router;