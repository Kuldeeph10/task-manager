const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get pending users for approval
// @route   GET /api/users/pending
// @access  Private/Admin
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false }).select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve user
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Reject/Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all employees (for task assignment)
// @route   GET /api/users/employees
// @access  Private/Manager/Admin
const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: 'employee',
      isApproved: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (All authenticated users)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, department, designation, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If changing password
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordMatch = await user.comparePassword(currentPassword);
      
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long',
        });
      }

      // Update password
      user.password = newPassword;
    }

    // Update other fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (designation !== undefined) user.designation = designation;

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(userId).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getPendingUsers,
  approveUser,
  deleteUser,
  getEmployees,
  updateUserRole,
  updateProfile,
};