import restaurant from "../models/schemas/Restaurant.js";
import food from "../models/schemas/Food.js";

export async function getMenuByRestaurant(req, res) {
  const { location, restaurantName } = req.params;
  const { resId } = req.query;
  try {
    const restroDetailsRes = await restaurant.findOne({
      city: { $regex: new RegExp(`^${location}$`, "i") },
      name: { $regex: new RegExp(`^${restaurantName}$`, "i") },
      resId: resId,
    });

    if (!restroDetailsRes)
      return res.status(404).json({
        status: 404,
        message: "Menu Not Found",
      });

    const restaurantDetails = {
      resId: restroDetailsRes.resId.toString(),
      name: restroDetailsRes.name,
      city: restroDetailsRes.city,
      average_cost_for_two: parseFloat(
        restroDetailsRes.average_cost_for_two.toString()
      ),
      address: restroDetailsRes.address,
      aggregate_rating: restroDetailsRes.aggregate_rating,
      locality: restroDetailsRes.locality,
    };

    const restaurantObjectID = restroDetailsRes._id;
    //look for menu

    const menuResponse = await food.find({
      resId: restaurantObjectID,
    });

    if (!menuResponse)
      return res.status(404).json({
        status: 404,
        message: "Menu Not Found",
      });

    let menuCategory = [];
    const formattedMenu = menuResponse.map((item) => {
      if (!menuCategory.includes(item.menu)) menuCategory.push(item.menu);

      return {
        id: item._id,
        menu: item.menu,
        item: item.item,
        itemId: item.itemId,
        isVeg: item.isVeg,
        price: parseFloat(item.price.toString()),
        image_url: "https://imgur.com/Fq3Jt1b.jpg",
      };
    });

    res.status(200).json({
      restaurant: restaurantDetails,
      menu: menuCategory,
      dishes: formattedMenu,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Server error ",
    });
  }
}
