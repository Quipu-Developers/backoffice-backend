const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { login } = require('../controllers/auth');
const router = express.Router();

// POST /login
router.post('/', isNotLoggedIn, login);
