import fs, { read } from "fs";

import csvParser from "csv-parser";
import restaurant from "../models/schemas/Restaurant.js";

const inputFilePath = "D:/csv/FDERestaurantsInPune.csv";
const readStream = fs.createReadStream(inputFilePath);

const printChunks = (res) => {
  readStream
    .pipe(csvParser())
    .on("data", async (row) => {
      row.name = row.name
        .split(" ")
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
      row.cuisine = row.cuisine.split(",").map((item) => item.trim());

      if (
        row.resId &&
        row.name &&
        row.average_cost_for_two &&
        row.longitude &&
        row.latitude &&
        row.city &&
        row.address
      ) {
        try {
          let restaurantEntry = new restaurant(row);
          await restaurantEntry.save();
        } catch (err) {
          console.log(err, row);
        }
      }
    })
    .on("end", () => {
      res.send("ok");
    });
};

export default printChunks;
