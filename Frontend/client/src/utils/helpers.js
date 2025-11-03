// Format date to readable format
export const formatDate = (date) => {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Get time ago (e.g., "2 hours ago")
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return Math.floor(seconds) + ' seconds ago';
};

// Check if date is overdue
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?';
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get badge class for status
export const getStatusBadgeClass = (status) => {
  const classes = {
    'pending': 'badge-status-pending',
    'in-progress': 'badge-status-in-progress',
    'completed': 'badge-status-completed',
    'on-hold': 'badge-status-on-hold',
  };
  return classes[status] || 'badge-status-pending';
};

// Get badge class for priority
export const getPriorityBadgeClass = (priority) => {
  const classes = {
    'low': 'badge-priority-low',
    'medium': 'badge-priority-medium',
    'high': 'badge-priority-high',
    'urgent': 'badge-priority-urgent',
  };
  return classes[priority] || 'badge-priority-medium';
};

// Get badge class for role
export const getRoleBadgeClass = (role) => {
  const classes = {
    'admin': 'badge-role-admin',
    'manager': 'badge-role-manager',
    'employee': 'badge-role-employee',
  };
  return classes[role] || 'badge-role-employee';
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Sort array by property
export const sortByProperty = (array, property, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (order === 'asc') {
      return a[property] > b[property] ? 1 : -1;
    }
    return a[property] < b[property] ? 1 : -1;
  });
};

// Filter tasks by status
export const filterTasksByStatus = (tasks, status) => {
  if (!status || status === 'all') return tasks;
  return tasks.filter(task => task.status === status);
};

// Group tasks by status
export const groupTasksByStatus = (tasks) => {
  return tasks.reduce((acc, task) => {
    const status = task.status || 'pending';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {});
};