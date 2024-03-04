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

  getAllResumes: async () => {
    return await Resume.find();
  },
};
