const { Scenes } = require("telegraf");
const { SCENES } = require("../../messages/dictionary");
const { comment } = require("./1_request_comment");
const { saveComment } = require("./2_save_comment");

const commentScene = new Scenes.WizardScene(
  SCENES.COMMENT,
  comment,
  saveComment
);

module.exports = {
  commentScene,
};
