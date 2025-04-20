import mongoose from "mongoose";

// sellSchema
const returnProductSchema = new mongoose.Schema(
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
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    returnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "returns",
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

const ReturnProduct = mongoose.model("returnproducts", returnProductSchema);

export default ReturnProduct;
