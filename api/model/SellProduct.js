import mongoose from "mongoose";

// sellSchema
const sellSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
    },
    unitCost: {
      type: Number,
    },
    total: {
      type: Number,
    },
    sellId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sell",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
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

const SellProduct = mongoose.model("sellproducts", sellSchema);

export default SellProduct;
