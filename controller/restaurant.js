import restaurant from "../models/schemas/Restaurant.js";

export async function getRestaurants(req, res) {
  const { location } = req.params;

  const { localities, cuisines, rating, costForTwo, offset } = req.query;

  const queryGenerator = (localities, cuisines, rating, costForTwo) => {
    let restaurantsQuery = {
      city: { $regex: new RegExp(`^${location}$`, "i") },
    };

    /* modify restaurantsQuery according to Queries */
    if (localities) {
      restaurantsQuery.locality = {
        $regex: new RegExp(`^${localities.replace(/,/g, "|")}$`, "i"),
      };
    }
    if (cuisines) {
      restaurantsQuery.cuisine = {
        $elemMatch: {
          $regex: new RegExp(`^${req.query.cuisines.replace(/,/g, "|")}$`, "i"),
        },
      };
    }
    if (rating) {
      const ratingsArray = rating.split(",").map((option) => {
        return parseFloat(option.slice(0, -1));
      });
      if (ratingsArray.length > 0) {
        const minRating = Math.min(...ratingsArray);
        restaurantsQuery.aggregate_rating = { $gt: minRating };
      }
    }
    if (costForTwo) {
      const seperateRanges = costForTwo.split(",").map((range) => {
        return range.split("-").map((value) => parseInt(value));
      });

      if (seperateRanges.length > 0) {
        restaurantsQuery.$or = seperateRanges.map((range) => {
          return {
            average_cost_for_two: { $gte: range[0], $lte: range[1] },
          };
        });
      }
    }
    return restaurantsQuery;
  };

  const mainQuery = queryGenerator(localities, cuisines, rating, costForTwo);
  const parsedOffset = parseInt(offset);

  /* Database interaction */
  try {
    /* could be a middleware */
    const totalDocumentForCity = await restaurant.countDocuments({
      city: { $regex: new RegExp(`^${location}$`, "i") },
    });

    if (totalDocumentForCity === 0)
      return res.status(503).json({
        status: 200,
        Name: "Service Unavailable",
        message: `Service currently unavailable in ${location.toUpperCase()} and is available in only Pune`,
      });

    const response = await restaurant
      .find(mainQuery)
      .skip(parsedOffset)
      .limit(10);
    /*total docCount  */
    let docCount;
    if (parsedOffset === 0) {
      docCount = await restaurant.countDocuments(mainQuery);
    }

    if (docCount === 0 && response.length === 0)
      return res.status(404).json({
        status: 404,
        message: "Restauratn Not Found",
      });

    /* restaurants array */
    const restaurants = response.map((item) => {
      const IMAGE_URLS = [
        "https://i.imgur.com/0YDbo8a.jpg",
        "https://imgur.com/pLAQy2H.jpg",
        "https://imgur.com/mtyt48Z.jpg",
        "https://imgur.com/cbqXQ57.jpg",
        "https://imgur.com/Fq3Jt1b.jpg",
      ];
      const img = (image_url) => {
        let randomNumber = Math.floor(Math.random() * 5);

        return image_url[randomNumber];
      };

      return {
        resId: item.resId.toString(),
        name: item.name,
        address: item.address,
        city: item.city,
        cuisine: item.cuisine,
        rating: item.aggregate_rating,
        establishment: item.establishment,
        average_cost_for_two: parseFloat(item.average_cost_for_two.toString()),
        latitude: item.latitude.toString(),
        longitude: item.longitude.toString(),
        image_url: img(IMAGE_URLS),
        locality: item.locality,
      };
    });

    let finalObject =
      parsedOffset === 0 ? { docCount, restaurants } : { restaurants };
    res.status(200).json(finalObject);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Something Went wrong",
    });
  }
}

const getRestaurantFilters = async (req, res) => {
  const { location } = req.params;

  try {
    const options = await restaurant.find(
      {
        city: { $regex: new RegExp(`^${location}$`, "i") },
      },
      { locality: 1, cuisine: 1, _id: 0 }
    );

    const rating = ["3.5+", "4.0+", "4.5+"];
    const costForTwo = ["300-800", "500-1000", "800-1200", "1200-1800"];
    let localities = [];
    let cuisines = [];

    options.forEach((option) => {
      if (!localities.includes(option.locality)) {
        localities.push(option.locality);
      }
      option.cuisine.forEach((item) => {
        if (!cuisines.includes(item)) {
          cuisines.push(item);
        }
      });
    });

    res.json({
      localities,
      cuisines,
      rating,
      costForTwo,
    });
  } catch (err) {
    res.status(404).json({
      status: 404,
      name: "Server Error",
      message: "SomeThing Went Wrong Comeback Later",
    });
  }
};

export { getRestaurantFilters };
