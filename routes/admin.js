const express = require('express');
const router = express.Router();

// Dummy admin data
const adminData = require('../admin/adminData.json');

// Admin routes
router.get('/', (req, res) => {
  res.json(adminData);
});

module.exports = router;
