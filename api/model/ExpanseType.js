import mongoose from "mongoose";

// expanseTypeSchema
const expanseTypeSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
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

const ExpanseType = mongoose.model("expansetypes", expanseTypeSchema);

export default ExpanseType;
