const { Comment } = require("../../../models/Comment");

module.exports.commentStorage = {
  create: async (comment) => {
    try {
      const time = new Date();
      comment.created_at = time;
      comment.updated_at = time;
      comment.user_id = comment.telegram_id;
      return await Comment.create(comment);
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    return await Comment.find();
  },
  getCommentById: async (commentId) => {
    try {
      return await Comment.findById(commentId);
    } catch (error) {
      throw error;
    }
  },
  getCommentsByUserId: async (userId) => {
    try {
      return await Comment.find({ user_id: userId });
    } catch (error) {
      throw error;
    }
  },
  getCommentsByProductId: async (productId) => {
    try {
      return await Comment.find({ product_id: productId });
    } catch (error) {
      throw error;
    }
  },
  getCommentsByVideoId: async (videoId) => {
    try {
      return await Comment.find({ video_id: videoId });
    } catch (error) {
      throw error;
    }
  },
  getCommentsByVideoIds: async () => {
    try {
      const commentsByVideoIds = await Comment.aggregate([
        {
          $group: {
            _id: "$video_id",
            comments: { $push: "$comment" },
          },
        },
      ]);

      return commentsByVideoIds;
    } catch (error) {
      throw error;
    }
  },
  getCommentsByResumeId: async (resumeId) => {
    try {
      return await Comment.find({ resume_id: resumeId });
    } catch (error) {
      throw error;
    }
  },
  getCommentsByVacancyId: async (vacancyId) => {
    try {
      return await Comment.find({ vacancy_id: vacancyId });
    } catch (error) {
      throw error;
    }
  },
  deleteComment: async (commentId) => {
    try {
      return await Comment.findByIdAndDelete(commentId);
    } catch (error) {
      throw error;
    }
  },
};
