const { model, Schema, default: mongoose } = require("mongoose");

const now = new Date();
now.setDate(now.getDate() + 7);

const billSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    dueDate: {
      type: Date,
      default:now
    },
    status: {
      type: String,
      require: true,
      enum: ["paid", "pending"],
    },
    billType: {
      type: String,
      require: true,
      enum: ["security", "other"],
    },
    amount: {
      type: Number,
      default:1000
    },
  },
  { timestamps: true }
);

module.exports = model("Bill", billSchema);
