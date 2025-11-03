const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingUsers,
  approveUser,
  deleteUser,
  getEmployees,
  updateUserRole,
  updateProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Update own profile (all authenticated users) - MUST BE BEFORE /:id routes
router.put('/profile', protect, updateProfile);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/pending', protect, authorize('admin'), getPendingUsers);
router.put('/:id/approve', protect, authorize('admin'), approveUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);

// Manager and Admin routes
router.get('/employees', protect, authorize('admin', 'manager'), getEmployees);

module.exports = router;