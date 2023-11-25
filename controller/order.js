import Order from "../models/schemas/Order.js";

const submitOrder = async (req, res) => {
  const body = req.body;
  const date = new Date();
  body.orderTime = date;

  try {
    const newOrder = new Order(body);
    await newOrder.save();
    res.status(200).json({
      status: 200,
      message: "Order placed",
    });
  } catch (err) {
    res.status(503).json({
      status: 503,
      message: "Somthing Went Wrong Try Again",
    });
  }
};

export default submitOrder;
