'use strict';

const express = require('express');
const authController = require('../../controllers/auth.controller');
const { authentication } = require('../../common/utils/auth.util');
const router = express.Router();

// sign up
router.post('/auth/sign-up', authController.signUp);
// sing in
router.post('/auth/login', authController.login);

router.post('/auth/handleRefreshToken', authController.handleRefreshToken);

// authentication
router.use(authentication);
// check authentication after access logout
router.post('/auth/logout', authController.logout);

module.exports = router;
