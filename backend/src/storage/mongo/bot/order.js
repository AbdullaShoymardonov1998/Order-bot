const { Order } = require("../../../models/Order");
const { PENDING } = require("../../../states");

exports.orderStorage = {
  create: async (order) => {
    const time = new Date();

    order.created_at = time;
    order.updated_at = time;
    (order.user_id = order.telegram_id), (order.status = PENDING);
    order.status_history = [
      {
        status: PENDING,
        created_at: time,
      },
    ];

    return await Order.create(order);
  },
};
