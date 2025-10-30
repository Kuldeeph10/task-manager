const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addComment,
  getTaskStats,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { taskValidation, validate } = require('../utils/validators');

// Manager/Admin routes
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  taskValidation,
  validate,
  createTask
);
router.get(
  '/all',
  protect,
  authorize('admin', 'manager'),
  getAllTasks
);
router.get(
  '/stats',
  protect,
  authorize('admin', 'manager'),
  getTaskStats
);
router.put(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  updateTask
);
router.delete(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  deleteTask
);

// Employee routes
router.get('/my-tasks', protect, getMyTasks);
router.put('/:id/status', protect, updateTaskStatus);

// All authenticated users
router.get('/:id', protect, getTaskById);
router.post('/:id/comments', protect, addComment);

module.exports = router;