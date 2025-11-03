const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingUsers,
  approveUser,
  deleteUser,
  getEmployees,
  updateUserRole,
  updateProfile, // Add this
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// ... existing routes ...

// Update own profile (all authenticated users)
router.put('/profile', protect, updateProfile);

module.exports = router;