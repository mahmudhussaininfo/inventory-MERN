import mongoose from "mongoose";

// supplierSchema
const supplierSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    supplierEmail: {
      type: String,
      required: true,
      unique: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Supplier = mongoose.model("suppliers", supplierSchema);

export default Supplier;
