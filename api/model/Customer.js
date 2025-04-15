import mongoose from "mongoose";

// customerSchema
const customerSchema = new mongoose.Schema(
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
    customerEmail: {
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

const Customer = mongoose.model("customers", customerSchema);

export default Customer;
