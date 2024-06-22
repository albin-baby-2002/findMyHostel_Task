const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },

    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
      enum: ["admin", "tenant"],
    },
    status: {
      type: String,
      require: true,
      enum: ["active", "vacated"],
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
