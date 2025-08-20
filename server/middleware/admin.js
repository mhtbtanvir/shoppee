const role = require('./RBAC'); // updated from access.js
const { protect } = require('./protectauth');

const adminOnly = [protect, role('admin')];

module.exports = adminOnly;
