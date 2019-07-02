const mongoose = require("mongoose");
const Item = require("./item.model");

const foodSchema = new mongoose.Schema({
  description: { type: String },
  weight: { type: Number }
});

const Food = Item.discriminator(
  "Food",
  foodSchema
);

module.exports = Food;
