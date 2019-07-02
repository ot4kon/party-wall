const mongoose = require("mongoose");
const Item = require("./item.model");

const drinkSchema = new mongoose.Schema({
  volume: { type: Number }
});

const Drink = Item.discriminator(
  "Drink",
  drinkSchema
);

module.exports = Drink;
