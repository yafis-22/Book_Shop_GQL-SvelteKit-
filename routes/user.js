const express = require('express');
const router = express.Router();

// Dummy user data
const userData = require('../user/userData.json');

// User routes
router.get('/', (req, res) => {
  res.json(userData);
});

module.exports = router;
