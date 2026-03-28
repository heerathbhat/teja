const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const Notification = require('../models/Notification');
const { getIO } = require('../utils/socket');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
router.post('/', protect, admin, upload.array('attachments', 5), async (req, res) => {
  const { title, description, assignedTo, dueDate } = req.body;

  try {
    const attachments = req.files.map(file => ({
      url: file.path,
      public_id: file.filename,
      fileName: file.originalname
    }));

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      createdBy: req.user._id,
      attachments
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Create persistent notification
    await Notification.create({
      recipient: assignedTo,
      sender: req.user._id,
      taskId: task._id,
      message: `New task assigned: ${title}`,
      type: 'TASK_ASSIGNED'
    });

    // Real-time socket alert
    const io = getIO();
    io.to(assignedTo.toString()).emit('notification', {
      type: 'TASK_ASSIGNED',
      message: `New task assigned: ${title}`,
      taskId: task._id
    });

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find({}).populate('assignedTo', 'name email').populate('createdBy', 'name email');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('createdBy', 'name email');
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update task status
// @route   PATCH /api/tasks/:id
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is allowed to update (Admin or assigned Intern)
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    if (req.body.status) {
      task.status = req.body.status;
    }
    if (req.user.role === 'admin') {
      if (req.body.title) task.title = req.body.title;
      if (req.body.description) task.description = req.body.description;
      if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;
      if (req.body.dueDate) task.dueDate = req.body.dueDate;
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    // Notify relevant party
    const isInternUpdating = req.user.role === 'intern';
    const recipientId = isInternUpdating ? populatedTask.createdBy._id : populatedTask.assignedTo._id;
    
    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      taskId: populatedTask._id,
      message: `Task "${populatedTask.title}" status updated to ${populatedTask.status}`,
      type: 'STATUS_UPDATED'
    });

    const io = getIO();
    io.to(recipientId.toString()).emit('notification', {
      type: 'STATUS_UPDATED',
      message: `Task "${populatedTask.title}" status updated to ${populatedTask.status}`,
      taskId: populatedTask._id
    });

    res.json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
