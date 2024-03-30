const { commentStorage } = require("../../storage/mongo/bot/comment");
const { userStorage } = require("../../storage/mongo/bot/user");

exports.commentService = {
  create: async (request) => {
    try {
      return {
        user: await userStorage.getByTelegramId(request.telegram_id),
        comment: await commentStorage.create(request),
      };
    } catch (error) {
      throw error;
    }
  },
  getAll: async () => {
    return await commentStorage.getAll();
  },
  getCommentById: async (query) => {
    return await commentStorage.getCommentById(query.comment_id);
  },
  getCommentByUserId: async (query) => {
    return await commentStorage.getCommentsByUserId(query.user_id);
  },
  getCommentByProductId: async (query) => {
    return {
      user: await userStorage.getByTelegramId(query.telegram_id),
      comment: await commentStorage.getCommentsByProductId(query.product_id),
    };
  },
  getCommentByVideoId: async (query) => {
    return {
      user: await userStorage.getByTelegramId(query.telegram_id),
      comment: await commentStorage.getCommentsByVideoId(query.video_id),
    };
  },
  getCommentsByVideoIds: async () => {
    return {
      comment: await commentStorage.getCommentsByVideoIds(),
    };
  },
  getCommentByResumeId: async (query) => {
    return {
      user: await userStorage.getByTelegramId(query.telegram_id),
      comment: await commentStorage.getCommentsByResumeId(query.resume_id),
    };
  },
  getCommentByVacancyId: async (query) => {
    return {
      user: await userStorage.getByTelegramId(query.telegram_id),
      comment: await commentStorage.getCommentsByVacancyId(query.vacancy_id),
    };
  },
  deleteCommentById: async (query) => {
    return await commentStorage.deleteComment(query);
  },
};
