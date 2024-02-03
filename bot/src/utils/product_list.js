const { WORD } = require("../messages/dictionary");

module.exports = async (cart, language) => {
  let productList = "";
  let total = 0;

  cart.forEach((product, index) => {
    let subTotal = product.quantity * product.product_id.price;
    total += subTotal;
    productList += `\n\n${index + 1}. ✨<b>${
      product.product_id.title[language]
    }</b>✨\n\n⚡️${
      product.product_id.description[language]
    }⚡️\n\n <b>Summa</b>: ${product.quantity} x ${product.product_id.price
      .toLocaleString()
      .replace(",", " ")} = ${subTotal
      .toLocaleString()
      .replace(",", " ")} \n\ <b>${WORD[language].MONEY}</b> \n`;
  });

  return {
    total,
    productList,
  };
};
