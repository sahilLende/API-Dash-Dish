import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema({
  itemId: {
    type: Schema.Types.UUID,
    require: true,
    unique: true,
  },
  menu: {
    type: String,
    required: true,
  },
  resId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "restaurant",
  },
  isVeg: {
    type: Boolean,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  price: {
    type: Schema.Types.Decimal128,
    required: true,
  },
});

const food = mongoose.model("food", foodSchema);
export default food;
