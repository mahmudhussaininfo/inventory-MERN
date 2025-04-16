import mongoose from "mongoose";

// expanseDataSchema
const expanseDataSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
    },
    note: {
      type: String,
    },
    expanseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpanseType",
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

const ExpanseData = mongoose.model("expansedata", expanseDataSchema);

export default ExpanseData;
