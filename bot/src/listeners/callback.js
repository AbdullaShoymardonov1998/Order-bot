const { STATE, STATIC } = require("../messages/dictionary");
const changeLanguage = require("../keyboards/change_language");
const category = require("../keyboards/category");
const productList = require("../keyboards/product_list");
const productInfo = require("../keyboards/product_info");
const limitExceed = require("../keyboards/limit_exceed");
const addToCart = require("../keyboards/add_to_cart");
const cart = require("../keyboards/cart");
const emptyCart = require("../keyboards/empty_cart");
const selectLocation = require("../keyboards/select_location");
const addLocation = require("../keyboards/add_location");
const confirmOrder = require("../keyboards/confirm_order");
const confirmedOrder = require("../keyboards/confirmed_order");
const { start } = require("../commands/start");

exports.callback = async (ctx) => {
  const callbackData = JSON.parse(ctx.callbackQuery.data);

  switch (callbackData.a) {
    case STATE.CHECK_GROUP:
      await start(ctx);
      break;
    case STATE.CHANGE_LANGUAGE:
      await changeLanguage(ctx, callbackData.language);
      break;
    case STATE.CATEGORY:
      await category(ctx, STATIC.EDIT_MESSAGE, callbackData.n, callbackData.p);
      break;
    case STATE.PRODUCT:
      await productList(ctx, callbackData.n, callbackData.p);
      break;
    case STATE.PRODUCT_INFO:
      await productInfo(ctx, callbackData.p, callbackData.q);
      break;
    case STATE.SHOW_QUANTITY:
      ctx.answerCbQuery(callbackData.d);
      break;
    case STATE.MIN_ORDER_LIMIT:
      await limitExceed(ctx, callbackData.p, STATE.MIN_ORDER_LIMIT);
      break;
    case STATE.MAX_ORDER_LIMIT:
      await limitExceed(ctx, callbackData.p, STATE.MAX_ORDER_LIMIT);
      break;
    case STATE.ADDED_TO_CART:
      await addToCart(ctx, callbackData.p, callbackData.n);
      break;
    case STATE.CART:
      await cart(ctx, STATIC.EDIT_MESSAGE);
      break;
    case STATE.EMPTY_CART:
      await emptyCart(ctx);
      break;
    case STATE.SELECT_LOCATION:
      await selectLocation(ctx);
      break;
    case STATE.ADD_LOCATION:
      await addLocation(ctx);
      break;
    case STATE.CONFIRM_ORDER:
      await confirmOrder(ctx, STATIC.EDIT_MESSAGE);
      break;
    case STATE.CONFIRM_DELIVERY:
      await confirmedOrder(ctx);
      break;
    default:
      console.log("incorrect callback data", callbackData);
  }
};
