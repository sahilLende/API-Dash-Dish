import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema({
  customerEmail: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]+$/.test(v) && v.length === 10;
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
    required: true,
  },

  orderTime: { type: Schema.Types.Date, required: true },
  deliveryAddress: {
    type: String,
    required: true,
  },
  amount: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  orderDetails: {
    type: Array,
    required: true,
  },
});

const Order = new model("order", orderSchema);

export default Order;
