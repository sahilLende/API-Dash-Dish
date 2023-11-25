import mongoose from "mongoose";
import bcrypt from "bcrypt";

const cartSchema = new mongoose.Schema([
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
    quantity: {
      type: Number,
      default: 0,
    },
    price: Number,
  },
]);

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("user", userSchema);

export default User;
