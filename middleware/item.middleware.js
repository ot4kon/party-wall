const Drink = require("../models/drink.model");
const Food = require("../models/food.model");
const Item = require("../models/item.model");

const ITEM_TYPES = {
  "food": Food,
  "drinks": Drink
};

const getModel = async (req, res, next) => {
  try {
    const { itemType } = req.params;

    if (itemType) {
      const model = ITEM_TYPES[itemType];

      if (!model) {
        throw new Error(`Invalid item type: ${itemType}`);
      }

      req.model = model;

      return next();
    }
    
    req.model = Item;

    next();
  } catch (err) {
    err.status = 400;
    err.body = {
      details: err.message
    };

    next(err);
  }
};

module.exports = getModel;
