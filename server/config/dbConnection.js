const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const mongodbUrl = process.env.MONGO_URL;

    if (!mongodbUrl) {
      throw new Error("mongodbUrl undefined");
    }

    await mongoose.connect(mongodbUrl);
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDB;
