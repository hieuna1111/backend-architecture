'use strict';

const express = require('express');
const accessController = require('../../controllers/user.controller');
const { authentication } = require('../../common/utils/auth.util');
const router = express.Router();

// sign up
router.post('/auth/sign-up', accessController.signUp);
// sing in
router.post('/auth/login', accessController.login);

// authentication
router.use(authentication);
// check authentication after access logout
router.post('/auth/logout', accessController.logout);

module.exports = router;
