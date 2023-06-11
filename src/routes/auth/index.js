'use strict';

const express = require('express');
const accessController = require('../../controllers/user.controller');
const router = express.Router();

// sign up
router.post('/shop/sign-up', accessController.signUp);

module.exports = router;
