'use strict';

const express = require('express');
const commentController = require('../../../../controllers/comment.controller');
const { authentication } = require('../../../../common/utils/auth.util');
const router = express.Router();

router
  .route('')
  .post(authentication, commentController.createComment)
  .get(authentication, commentController.getCommentByParentId);

module.exports = router;
