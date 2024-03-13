const { WORD } = require("../messages/dictionary");
const { underwearIds, sleepwearIds, blanketIds, socksId } = require("./consts");

module.exports = async (cart, language) => {
  let productList = "";
  let total = 0;

  for (let i = 0; i < cart.length; i++) {
    const product = cart[i];

    const quantity = parseInt(product.quantity);
    const isUnderwear = underwearIds.includes(product.product_id.parent);
    const isSleepwear = sleepwearIds.includes(product.product_id.parent);
    const isBlanket = blanketIds.includes(product.product_id.parent);
    const isSocks = socksId.includes(product.product_id.parent);

    let unit = 1.5;
    if (isUnderwear && quantity >= 12) {
      unit = 1.0;
    } else if (isUnderwear && quantity >= 6 && quantity < 12) {
      unit = 1.1;
    } else if (isSleepwear && quantity >= 6) {
      unit = 1.0;
    } else if (isSleepwear && quantity > 2 && quantity < 6) {
      unit = 1.1;
    } else if (isSocks && quantity >= 24) {
      unit = 1.0;
    } else if (isSocks && quantity >= 12 && quantity < 24) {
      unit = 1.1;
    } else if (isBlanket && quantity >= 5) {
      unit = 1.0;
    } else if (isBlanket && quantity > 2 && quantity < 5) {
      unit = 1.1;
    } else if (quantity >= 10) {
      unit = 1.0;
    } else if (quantity >= 5 && quantity <= 10) {
      unit = 1.1;
    }
    const productFinalPrice = product.product_id.price * unit;
    const subTotal = quantity * productFinalPrice;
    total += subTotal;
    const color =
      (product.product_id.colors &&
        product.product_id.colors.find((c) => c.id === product.color_id)
          ?.name) ||
      "Color not found";
    const size =
      product.product_id.sizes.find((s) => s._id === product.size_id)?.name ||
      "Size not found";

    productList += `\n\n${i + 1}. Mahsulot kodi: <b>${
      product.product_id.title[language]
    }</b>\n\nMahsulot haqida: ${
      product.product_id.description[language]
    }\n\nRangi: <b><i>${color}</i></b>\n\nMahsulot o'lchami : <b><i>${size}</i></b>\n\n⚡️\n\n Umumiy summa: <b><i>${quantity}</i> x <i>${productFinalPrice
      .toLocaleString()
      .replace(",", " ")} = ${subTotal
      .toLocaleString()
      .replace(",", " ")}</i></b> \n\ <b>${WORD[language].MONEY}</b> \n`;
  }

  return {
    total,
    productList,
  };
};
