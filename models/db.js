import { connect } from "mongoose";
import Debug from "debug";
const logger = Debug("DBConnection");

const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";

if (!MONGODB_URL) {
  throw new Error("MONGODB_URI must be defined");
}

const connectToMongoose = async () => {
  try {
    await connect(MONGODB_URL);
    return logger("Great! Connected to DB 💚");
  } catch (err) {
    return logger("Opps! DB connection not established 💔", err);
  }
};

export default connectToMongoose;
