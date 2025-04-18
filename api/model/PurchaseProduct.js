import mongoose from "mongoose";

// supplierSchema
const purchaseSchema = new mongoose.Schema(
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
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "purchases",
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

const Purchase = mongoose.model("purchases", purchaseSchema);

export default Purchase;
