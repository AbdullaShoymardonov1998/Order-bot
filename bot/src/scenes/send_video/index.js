const { Scenes } = require("telegraf");
const { requestVideo } = require("./1_request_video");
const { saveVideo } = require("./2_save_video");
const { requestVideoText } = require("./3_request_video_caption");
const { SCENES } = require("../../messages/dictionary");

const addVideoScene = new Scenes.WizardScene(
  SCENES.SEND_VIDEO,
  requestVideo,
  saveVideo,
  requestVideoText
);

module.exports = {
  addVideoScene,
};
