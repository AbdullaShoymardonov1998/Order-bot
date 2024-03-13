const { STATE, STATIC, SCENES } = require("../messages/dictionary");
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
const sendVideoToUsers = require("../keyboards/send_video_to_users");
const rejectedVideo = require("../keyboards/send_video_rejection");
const { start } = require("../commands/start");
const vacancy_category = require("../keyboards/vacancy_category");
const vacancy_info = require("../keyboards/vacancy_info");
const vacancy_list = require("../keyboards/vacancy_list");
const vacancy = require("../keyboards/vacancy");

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
      await productInfo(ctx, callbackData.p);
      break;
    case STATE.SELECT_COLOR:
      await ctx.scene.enter(SCENES.CHOOSE_COLOR, { colorId: callbackData.c });
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
    case STATE.SEND_VIDEO:
      await ctx.scene.enter(SCENES.SEND_VIDEO);
      break;
    case STATE.CONFIRMED_VIDEO:
      await sendVideoToUsers(ctx);
      break;
    case STATE.REJECTED_VIDEO:
      await rejectedVideo(ctx);
      break;
    case STATE.VACANCY_MAIN:
      await vacancy(ctx);
      break;
    case STATE.VACANCY:
      await ctx.scene.enter(SCENES.VACANCY);
      break;
    case STATE.VACANCY_CATEGORY:
      await vacancy_category(ctx);
      break;
    case STATE.VACANCY_LIST:
      await vacancy_list(ctx, callbackData.v, callbackData.n);
      break;
    case STATE.VACANCY_INFO:
      await vacancy_info(ctx, callbackData.v);
      break;
    case STATE.RESUME:
      await ctx.scene.enter(SCENES.RESUME);
      break;
    default:
      console.log("incorrect callback data", callbackData);
  }
};
