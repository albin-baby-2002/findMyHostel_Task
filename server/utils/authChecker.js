const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");
const mongoose = require("mongoose");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = async (req) => {
  const token = req.cookies.token;

  if (!token) return null;

  const foundUser = await User.findOne({ token });

  if (!foundUser) return null;

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    let decodedID = new mongoose.Types.ObjectId(decoded.id);
    let userID = new mongoose.Types.ObjectId(foundUser._id);

    if (!userID.equals(decodedID)) {
      return null;
    }
    return foundUser;
  } catch (err) {
    return null;
  }
};
