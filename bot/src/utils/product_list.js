const { logger } = require("../config/logger");
const { WORD } = require("../messages/dictionary");

module.exports = async (cart, language) => {
  let productList = "";
  let total = 0;

  cart.forEach((product, index) => {
    let subTotal = product.quantity * product.product_id?.price;
    total += subTotal;
    console.log(product.product_id);
    const color =
      product.product_id.colors.find((c) => c.id === product.color_id)?.name ||
      "Color not found";
    const size =
      product.product_id.sizes.find((s) => s._id === product.size_id)?.name ||
      "Size not found";

    productList += `\n\n${index + 1}. ✨<b>${
      product.product_id.title[language]
    }</b>✨\n\n ⚡️${
      product.product_id.description[language]
    }\n\n<b>Rangi: ✨ <i>${color}</i></b>\n\n<b>Mahsulot o'lchami : ✨ <i>${size}</i></b>\n\n⚡️\n\n <b>Umumiy summa: <i>${
      product.quantity
    }</i> x <i>${product.product_id?.price
      .toLocaleString()
      .replace(",", " ")} = ${subTotal
      .toLocaleString()
      .replace(",", " ")}</i></b> \n\ <b>${WORD[language].MONEY}</b> \n`;
  });

  return {
    total,
    productList,
  };
};
