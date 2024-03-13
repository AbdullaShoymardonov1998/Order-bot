const { Scenes } = require("telegraf");
const { SCENES } = require("../../messages/dictionary");
const { fullName } = require("./1_request_full_name");
const { about } = require("./2_request_about");
const { experience } = require("./3_request_experience");
const { skills } = require("./4_request_skills");
const { expectedSalary } = require("./5_requst_salary");
const { resumeCategory } = require("./6_requst_choosing_category");
const { resumeContact } = require("./7_requst_contact");
const { confirmResumeData } = require("./8_confirm_entered_data");
const { saveResumeInfo } = require("./9_save_resume_info");

const resumeScene = new Scenes.WizardScene(
  SCENES.RESUME,
  fullName,
  about,
  experience,
  skills,
  expectedSalary,
  resumeCategory,
  resumeContact,
  confirmResumeData,
  saveResumeInfo
);

module.exports = {
  resumeScene,
};
