import mongoose from "mongoose";

// sellSchema
const sellSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    note: {
      type: String,
    },
    vatTax: {
      type: Number,
    },
    disCount: {
      type: Number,
    },
    otherCost: {
      type: Number,
    },
    shippingCost: {
      type: Number,
    },
    grandTotal: {
      type: Number,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Sell = mongoose.model("sell", sellSchema);

export default Sell;
