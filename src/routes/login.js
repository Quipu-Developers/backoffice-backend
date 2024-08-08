const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedin } = require('../middlewares');
const { login } = require('../controllers/auth');
const router = express.Router();

// POST /login
router.post('/login', isNotLoggedin, login);

module.exports = router;