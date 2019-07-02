const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_KEY } = process.env;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});


userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const hash = await bcrypt.hash(user.password, 6);
    user.password = hash;
  }

  next();
});


userSchema.methods.createToken = async function () {
  const user = this;
  const token = jwt.sign({
    _id: user._id,
  }, JWT_KEY)

  user.tokens = [ ...user.tokens, { token } ];
  await user.save();

  return token;
};


userSchema.methods.removeToken = async function (token) {
  const user = this;

  user.tokens = user.tokens.filter(tokenObj => tokenObj.token !== token);
  await user.save();

  return user.tokens;
};


userSchema.methods.removeAllTokens = async function () {
  const user = this;

  user.tokens = [];
  await user.save();

  return user.tokens;
}


userSchema.statics.findUser = async function (username, password) {
  const user = await User.findOne({ username });
  const validCredentials = user // perhaps short, but may be confusing and does not give info what is wrong, username or password, can be changed
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!validCredentials) {
    throw new Error("Invalid credentials");
  }

  return user;
};


const User = mongoose.model(
  "User",
  userSchema,
  "users"
);

module.exports = User;
