import fs, { read } from "fs";

import csvParser from "csv-parser";
import food from "../models/schemas/Food.js";

const inputFilePath = "D:/csv/FDE.menuwell.csv";
const readStream = fs.createReadStream(inputFilePath);
/* 
const addFood = (res) => {
  readStream
    .pipe(csvParser())
    .on("data", async (row) => {
      row.isVeg = row.isVeg === "veg" ? true : false;
      if (row.itemId && row.resId && row.item && row.menu && row.price) {
        try {
          let menuItem = new food(row);
          await menuItem.save();
        } catch (err) {
          console.count("skipped");
        }
      }
    })
    .on("end", () => {
      res.send("done");
    });
};
 */

const addFood = (res) => {
  let batch = [];
  const batchSize = 1000; // Adjust this value based on your needs

  readStream
    .pipe(csvParser())
    .on("data", async (row) => {
      if (row.itemId && row.resId && row.item && row.menu && row.price) {
        batch.push(new food(row));

        if (batch.length === batchSize) {
          try {
            await food.insertMany(batch);
            batch = [];
          } catch (err) {
            console.count(err);
          }
        }
      }
    })
    .on("end", async () => {
      if (batch.length > 0) {
        try {
          await food.insertMany(batch);
        } catch (err) {
          console.count(err);
        }
      }
      res.send("done");
    });
};

export default addFood;
