import mongoose, { Schema } from "mongoose";

const restaurantSchema = new Schema({
  resId: {
    type: Schema.Types.UUID,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  establishment: String,
  aggregate_rating: Number,

  city: {
    type: String,
    required: true,
  },
  average_cost_for_two: { type: Schema.Types.Decimal128, required: true },
  locality: String,

  latitude: {
    type: Schema.Types.Decimal128,
    required: true,
  },
  longitude: {
    type: Schema.Types.Decimal128,
    required: true,
  },

  cuisine: [String],

  address: {
    type: String,
    required: true,
  },
  locality: {
    type: String,
  },
});

const restaurant = mongoose.model("restaurant", restaurantSchema);

export default restaurant;
// embedding (having nested arrray)
//referencing
