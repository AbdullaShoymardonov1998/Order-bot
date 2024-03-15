const { Resume } = require("../../../models/Resume");

module.exports.resumeStorage = {
  create: async (resume) => {
    const time = new Date();
    resume.created_at = time;
    resume.updated_at = time;
    resume.user_id = resume.telegram_id;
    try {
      return await Resume.create(resume);
    } catch (error) {
      throw error;
    }
  },

  getResumeById: async (resumeId) => {
    try {
      return await Resume.findById(resumeId);
    } catch (error) {
      throw error;
    }
  },
  getResumeByUserId: async (userId) => {
    try {
      return await Resume.find({ user_id: userId });
    } catch (error) {
      throw error;
    }
  },
  getResumesByCategory: async (category_id) => {
    try {
      return await Resume.find({
        category_id: category_id,
        status: "available",
      });
    } catch (error) {
      throw error;
    }
  },
  getAllResumes: async () => {
    return await Resume.find();
  },
  find: async (req) => {
    const DEFAULT_LIMIT = 10;
    let filter = {
      deleted_at: null,
      category_id: req.category_id,
    };
    const page = req.page ? req.page - 1 : 0;
    let options = {
      skip: page * (req.limit ? req.limit : DEFAULT_LIMIT),
      limit: req.limit ? req.limit : DEFAULT_LIMIT,
    };
    const findResume = () =>
      new Promise((resolve, reject) => {
        Resume.find(filter, null, options)
          .sort({ created_at: 1 })
          .exec((err, templates) => {
            if (err) {
              reject(err);
            }
            return resolve(templates || []);
          });
      });
    const countResume = () =>
      new Promise((resolve, reject) => {
        Resume.countDocuments(filter, (err, count) => {
          if (err) {
            reject(err);
          }
          return resolve(count);
        });
      });

    const [list, total] = await Promise.all([findResume(), countResume()]);
    const total_pages =
      total % options.limit == 0
        ? parseInt(total / options.limit)
        : parseInt(total / options.limit) + 1;
    return {
      list,
      total,
      total_pages,
      page: page + 1,
      page_total: list.length,
      limit: options.limit,
    };
  },
};
