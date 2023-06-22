'use strict';

const express = require('express');
const authController = require('../../controllers/auth.controller');
const { authentication } = require('../../common/utils/auth.util');
const router = express.Router();

// sign up
router.post('/sign-up', authController.signUp);
// sing in
router.post('/login', authController.login);

// check authentication after access logout
router.post('/logout', authentication, authController.logout);
router.post('/renew-token', authentication, authController.renewToken);

module.exports = router;
