const mongoose = require("mongoose");
const JustDate = require("../utils/justDate");
const opts = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
};
const transactionSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    transactionId: {
      type: Number,
      default: 1,
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: JustDate(new Date()),
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    user: {
      type: String,
      // required: true
    },
    status: {
      type: String,
      lowercase: true,
      default: "open",
    },
    transactionType: {
      type: String,
      lowercase: true,
      default: "payemnt"
    },
  },
  opts
);


transactionSchema.pre("save", async function (next) {
  //sorting transactions
  const transactions = await Transaction.find({}).sort([["transactionId", -1]]);

  if (transactions.length > 0) {
    this.transactionId = transactions[0].transactionId + 1;
  }
  next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
