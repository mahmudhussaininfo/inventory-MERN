import mongoose from "mongoose";
import ExpanseType from "../model/ExpanseType.js";
import asyncHandler from "express-async-handler";
import { checkAssociateService } from "../services/checkAssociateService.js";
import ExpanseData from "../model/ExpanseData.js";

// get all ExpanseTypes
export const getAllExpanseType = asyncHandler(async (req, res) => {
  const expanseType = await ExpanseType.find();
  if (!expanseType || expanseType.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No ExpanseType Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "expanseType fetch success", expanseType });
});

// register ExpanseType
export const registerExpanseType = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { email } = req.user;

  // check if all fields are present
  if (!name) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if ExpanseType exist
  const existingExpanseType = await ExpanseType.findOne({ name });
  if (existingExpanseType) {
    return res.status(400).json({
      status: false,
      message: "ExpanseType already exist",
    });
  }

  // create ExpanseType
  const expanseType = await ExpanseType.create({
    userEmail: email,
    name,
  });

  return res.status(201).json({
    status: true,
    message: "ExpanseType created successfully",
    expanseType,
  });
});

// update ExpanseType
export const updateExpanseType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  const expanseType = await ExpanseType.findByIdAndUpdate(
    { _id: id },
    reqBody,
    {
      new: true,
    }
  );

  if (!expanseType) {
    return res.status(400).json({
      status: false,
      message: "ExpanseType id not found",
    });
  }

  return res.status(200).json({
    status: true,
    message: "ExpanseType updated successfully",
    expanseType,
  });
});

// ExpanseType listing
export const expanseTypeList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const perPage = Number(req.params.perPage) || 1;
  const pageNo = Number(req.params.pageNo) || 10;
  const keyword = req.params.keyword || "";

  const skip = (pageNo - 1) * perPage;

  let matchStage = {
    userEmail: email,
  };

  if (keyword && keyword !== "0") {
    matchStage.name = {
      $regex: keyword,
      $options: "i",
    };
  }

  const [total, expanseTypes] = await Promise.all([
    ExpanseType.countDocuments(matchStage),
    ExpanseType.find(matchStage).skip(skip).limit(perPage),
  ]);

  return res.status(200).json({
    success: true,
    message: "ExpanseTypes fetch success",
    data: {
      total,
      expanseTypes,
    },
  });
});

// expanseType Delete
export const deleteExpanseType = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const objectId = new mongoose.Types.ObjectId(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid ID",
    });
  }

  const checkAssociate = await checkAssociateService(
    { expanseId: objectId },
    ExpanseData
  );
  if (checkAssociate) {
    return res.status(404).json({
      status: "associate",
      message: "expanse is associated with a ExpanseData cannot be deleted",
    });
  }
  const result = await ExpanseType.findByIdAndDelete(id);
  if (!result) {
    return res
      .status(404)
      .json({ status: false, message: "expanse Not Found" });
  }

  return res
    .status(200)
    .json({ status: true, message: "Delete expanseType Success", result });
});
