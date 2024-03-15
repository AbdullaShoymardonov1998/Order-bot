const { Scenes } = require("telegraf");
const { SCENES } = require("../../messages/dictionary");
const { fullName } = require("./1_request_full_name");
const { profession } = require("./2_request_profession");
const { about } = require("./3_request_about");
const { experience } = require("./4_request_experience");
const { skills } = require("./5_request_skills");
const { expectedSalary } = require("./6_requst_salary");
const { resumeCategory } = require("./7_requst_choosing_category");
const { resumeContact } = require("./8_request_contact");
const { resumeFile } = require("./9_request_resume_file");
const { confirmResumeData } = require("./10_confirm_entered_data");
const { saveResumeInfo } = require("./11_save_resume_info");

const resumeScene = new Scenes.WizardScene(
  SCENES.RESUME,
  fullName,
  profession,
  about,
  experience,
  skills,
  expectedSalary,
  resumeCategory,
  resumeContact,
  resumeFile,
  confirmResumeData,
  saveResumeInfo
);

module.exports = {
  resumeScene,
};
