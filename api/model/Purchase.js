import mongoose from "mongoose";

// supplierSchema
const purchaseSchema = new mongoose.Schema(
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
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "suppliers",
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
