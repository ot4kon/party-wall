const mongoose = require("mongoose");

const options = {
  discriminatorKey: "itemType",
  collection: "items"
};

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  },
  options
);

const Item = mongoose.model(
  "Item",
  itemSchema,
  "items"
);

module.exports = Item;
