import express from "express";
import "dotenv/config";
import connectToMongoose from "./models/db.js";
import routes from "./v1/routes/index.js";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:5173", "http://192.168.1.41:5173"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.set("trust proxy", true);
/* connect to database */
connectToMongoose();
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

/*middleware */
app.use(helmet());
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(express.json());
app.use("/", routes);

// Configure urlencoded middleware here

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
