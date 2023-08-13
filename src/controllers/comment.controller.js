'use strict';

const catchAsync = require('../common/helpers/catchAsync.helper');
const {
  createdResponse,
  okResponse,
} = require('../common/utils/handleSuccess.util');
const CommentService = require('../services/comment.service');

class CommentController {
  createComment = catchAsync(async (req, res) => {
    const data = await CommentService.createComment(req.body);
    createdResponse({
      res,
      message: 'Create comment successfully!',
      metadata: data,
    });
  });

  getCommentByParentId = catchAsync(async (req, res) => {
    const data = await CommentService.getCommentByParentId(req.query);
    createdResponse({
      res,
      message: 'Get comments successfully!',
      metadata: data,
    });
  });

  deleteComments = catchAsync(async (req, res) => {
    okResponse({
      res,
      message: 'Delete comments successfully!',
      metadata: await CommentService.deleteComments(req.body),
    });
  });
}

module.exports = new CommentController();
