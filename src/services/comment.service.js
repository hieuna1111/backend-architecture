'use strict';

const { throwBadRequest } = require('../common/utils/handleError.util');
const toObject = require('../common/utils/objectId.util');
const CommentModel = require('../models/comment.model');
/**
 * Add comment [User | Owner]
 * Get a list comments [User | Owner]
 * Delete a comment [User | Owner| Admin]
 */
class CommentService {
  static async createComment({ productId, userId, content, parentCommentId }) {
    const comment = new CommentModel({
      productId,
      userId,
      content,
      parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);
      throwBadRequest(!parentComment, 'Parent comment not found');

      rightValue = parentComment.commentRight;
      await CommentModel.updateMany(
        {
          productId: toObject(productId),
          commentRight: { $gte: rightValue },
        },
        { $inc: { commentRight: 2 } }
      );

      await CommentModel.updateMany(
        {
          productId: toObject(productId),
          commentLeft: { $gte: rightValue },
        },
        { $inc: { commentLeft: 2 } }
      );
    } else {
      const commentHasMaxRightValue = await CommentModel.findOne(
        { productId: toObject(productId) },
        'commentRight'
        // { sort: { commentRight: -1 } }
      );

      if (commentHasMaxRightValue)
        rightValue = commentHasMaxRightValue.commentRight + 1;
      else rightValue = 1;
    }

    comment.commentLeft = rightValue;
    comment.commentRight = rightValue + 1;
    await comment.save();
    return comment;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);
      throwBadRequest(!parentComment, 'Not found comment for product');

      const comments = await CommentModel.find({
        productId: toObject(productId),
        commentLeft: { $gte: parentComment.commentLeft },
        commentRight: { $lte: parentComment.commentRight },
      })
        .select({
          commentLeft: 1,
          commentRight: 1,
          content: 1,
          parentCommentId: 1,
        })
        .sort({
          commentLeft: 1,
        });

      return comments;
    }

    const comments = await CommentModel.find({
      productId: toObject(productId),
      $or: [{ parentCommentId: null }, { parentCommentId: { $exists: false } }],
    })
      .select({
        commentLeft: 1,
        commentRight: 1,
        content: 1,
        parentCommentId: 1,
      })
      .sort({
        commentLeft: 1,
      });

    return comments;
  }
}

module.exports = CommentService;
