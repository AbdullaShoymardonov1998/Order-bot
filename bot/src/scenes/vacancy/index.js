const { Scenes } = require("telegraf");
const { SCENES } = require("../../messages/dictionary");
const { vacancyTitle } = require("./1_request_title");
const { vacancySalary } = require("./5_requst_salary");
const { vacancyCategory } = require("./6_requst_choosing_category");
const { vacancyContact } = require("./7_requst_contact");
const { saveVacancyInfo } = require("./9_save_vacancy_info");
const { confirmVacancyData } = require("./8_confirm_entered_data");
const { vacancyCompany } = require("./2_request_company");
const { vacancyResponsibility } = require("./3_request_responsibility");
const { vacancyRequirement } = require("./4_request_requirement");

const vacancyScene = new Scenes.WizardScene(
  SCENES.VACANCY,
  vacancyTitle,
  vacancyCompany,
  vacancyResponsibility,
  vacancyRequirement,
  vacancySalary,
  vacancyCategory,
  vacancyContact,
  confirmVacancyData,
  saveVacancyInfo
);

module.exports = {
  vacancyScene,
};
