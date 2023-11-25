import User from "../models/schemas/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const body = req.body;
  try {
    const foundUser = await User.findOne({ email: body.email });

    if (foundUser) {
      return res.status(409).json({
        status: 409,
        message: "Email already Exits",
      });
    }
    const newUser = new User(body);
    await newUser.save();

    res.status(200).json({
      status: 200,
      message: "Registered",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const logInUser = async (req, res) => {
  const body = req.body;
  try {
    const user = await User.findOne({
      email: body.email,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const matches = bcrypt.compareSync(body.password, user.password);

    if (!matches)
      return res.status(403).json({
        message: "Invalid Passowrd",
      });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_PRIVATE_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "604800",
      }
    );

    res.status(200).json({
      status: 200,
      message: "Logged In",
      user: {
        token,
        email: user.email,
        name: user.firstName + " " + user.lastName,
        gender: user.gender,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went Wrong",
    });
  }
};

export { registerUser, logInUser };
