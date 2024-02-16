const { Scenes } = require("telegraf");
const { chooseColor } = require("./1_request_choosing_product");
const { requestChoosingQuantity } = require("./2_response_choosing_product");
const { SCENES } = require("../../messages/dictionary");
const { saveOrder } = require("./3_save_order");

const chooseColorScene = new Scenes.WizardScene(
  SCENES.CHOOSE_COLOR,
  chooseColor,
  requestChoosingQuantity,
  saveOrder
);

module.exports = {
  chooseColorScene,
};
