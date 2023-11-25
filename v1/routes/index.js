import { Router } from "express";

const router = Router();
import { getMenuByRestaurant } from "../../controller/menu.js";
import {
  getRestaurantFilters,
  getRestaurants,
} from "../../controller/restaurant.js";
import { registerUser, logInUser } from "../../controller/authenticate.js";
import submitOrder from "../../controller/order.js";

router.get("/order/:location", getRestaurants);
router.get("/order/:location/filters", getRestaurantFilters);
router.post("/user/register", registerUser);
router.post("/user/login", logInUser);
router.post("/checkout", submitOrder);
router.get("/order/:location/restaurant/:restaurantName", getMenuByRestaurant);

export default router;
