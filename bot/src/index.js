require("dotenv").config();
const { Telegraf, session } = require("telegraf");
const { logger } = require("./config/logger");
const { commands } = require("./commands");
const { listeners } = require("./listeners");
const { WORD, STATE } = require("./messages/dictionary");
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  let result = null;
  try {
    result = await ctx.telegram.getChatMember(
      `${process.env.GROUP_ID}`,
      ctx.update.message?.from.id || ctx.update.callback_query?.from.id
    );
  } catch (error) {
    console.log("Middleware error: " + error.message);
    return;
  }

  if (ctx.update.message?.text === "/start") {
    return next();
  }
  if (!ctx.update.message?.left_chat_participant && result?.status === "left") {
    if (ctx.update.callback_query) {
      await ctx.answerCbQuery();
      return await ctx.editMessageText(WORD.UZ.CHECK_JOIN_GROUP, {
        disable_web_page_preview: true,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                url: `${WORD.UZ.GROUP_LINK}`,
                text: WORD.UZ.JOIN_GROUP,
                callback_data: JSON.stringify({
                  type: STATE.CHECK_GROUP,
                }),
              },
            ],
          ],
        },
      });
    }
  }
  await next();
});

commands(bot);
listeners(bot);
bot.catch((err, ctx) => {
  console.log(err.stack);
  const userId = ctx.from?.id;
  const chatId = ctx.chat?.id;
  const updateType = ctx.updateType;

  // Log the error with relevant information
  logger.error(
    `Oops, encountered an error for update type: ${updateType}, user ID: ${userId}, chat ID: ${chatId}. Error: ${JSON.stringify(
      err
    )}`,
    err
  );

  if (!err?.response?.description?.includes("exactly the same as")) {
    ctx.replyWithHTML(WORD.GENERAL.ERROR);
  }
});

bot.launch().then(() => {
  logger.info("Bot started");
});

// Enable graceful stop
process.once("SIGINT", () => {
  logger.info("Shut down");
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  logger.info("Shut down");
  bot.stop("SIGTERM");
});
