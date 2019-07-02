const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { JWT_KEY } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const data = jwt.verify(token, JWT_KEY);
    const user = await User.findOne({
      _id: data._id,
      "tokens.token": token
    });

    if (!user) {
      throw new Error("No user assigned to specified token");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    err.status = 401;
    err.message = err.message || "Authorization failed!";
    err.body = {
      details: "Authorization failed!"
    };

    next(err);
  }
};

module.exports = authenticate;
