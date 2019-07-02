const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const authenticate = require("../middleware/auth.middleware");

// todo: better error handling, like username/password validation, not exposing mongoose errors, etc.

router.post("/register", async (req, res, next) => {
  try {
    // can also specify flag if user should be logged in after registration
    const { username, password } = req.body;
    const user = new User({
      username,
      password
    });

    await user.save();

    res.status(201).send();
  } catch (err) {
    err.status = 400;
    err.body = {
      details: err.message
    };

    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findUser(username, password);
    const token = await user.createToken();

    res.send({ token });
  } catch (err) {
    err.status = 400;
    err.body = {
      details: err.message
    };

    next(err);
  }
});

router.post("/logout", authenticate, async (req, res, next) => {
  // user can be logged in on multiple devices
  const { user, token } = req;

  await user.removeToken(token);
  
  res.sendStatus(200);
});

router.post("/logout-all", authenticate, async (req, res, next) => {
  // logs user out on every device that user is logged in
  const { user } = req;

  await user.removeAllTokens();

  res.sendStatus(200);
});

router.get("/profile", authenticate, async (req, res, next) => {
  const { user: { username } } = req;

  res.send({ username });
});

module.exports = router;
