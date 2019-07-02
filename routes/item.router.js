const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth.middleware");
const getModel = require("../middleware/item.middleware");

router.use(authenticate);
router.use("/:itemType?", getModel);

// todo: less try...catch boilerplate
// todo: better error handling, not expose mongoose errors, etc.

router.get("/:itemType?", async (req, res, next) => {
  // if no itemType specified, types can be grouped, either after specyfing a flag or by default
  try {
    const items = await req.model.find();

    res.send(items);
  } catch (err) {
    err.status = 400;
    err.body = {
      details: err.message
    };

    next(err);
  }
});

router.post("/:itemType", async (req, res, next) => {
  try {
    const { itemType } = req.params;

    if (!itemType) {
      throw new Error("Item type needs to be specified!");
    }

    const item = new req.model(req.body);

    await item.save();

    res.sendStatus(201);
  } catch (err) {
    err.status = 400;
    err.body = {
      details: err.message
    };

    next(err);
  }
});

router.get("/:itemType?/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await req.model.findById(id);

    res.send(item);
  } catch (err) {
    err.status = 400;
    err.body = {
      details: err.message
    };

    next(err);
  }
});

router.delete("/:itemType?/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await req.model.findByIdAndRemove(id);

    res.sendStatus(204);
  } catch (err) {
    err.status = 400;
    err.body = {
      details: err.message
    };

    next(err);
  }
});

module.exports = router;
