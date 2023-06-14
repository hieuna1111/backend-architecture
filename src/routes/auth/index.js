'use strict';

const express = require('express');
const accessController = require('../../controllers/user.controller');
const router = express.Router();

// sign up
router.post('/auth/sign-up', accessController.signUp);
// sing in
router.post('/auth/login', accessController.login);

module.exports = router;
