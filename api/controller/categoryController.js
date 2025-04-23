import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";
import { checkAssociateService } from "../services/checkAssociateService.js";
import Product from "../model/Product.js";
import mongoose from "mongoose";

// get all Cagetorys
export const getAllCategory = asyncHandler(async (req, res) => {
  const category = await Category.find().select("_id name");
  if (!category || category.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No category Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "category fetch success", category });
});

// categoryDetail BY ID
export const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Category id is not Valid" });
  }
  const category = await Category.findById(id);
  if (!category || category.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No Category Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Category id fetch success", category });
});

// register Cagetory
export const registerCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { email } = req.user;

  // check if all fields are present
  if (!name) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if category exist
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({
      status: false,
      message: "Category already exist",
    });
  }

  // create Category
  const category = await Category.create({
    userEmail: email,
    name,
  });

  return res.status(201).json({
    status: true,
    message: "category created successfully",
    category,
  });
});

// update Category
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  const category = await Category.findByIdAndUpdate({ _id: id }, reqBody, {
    new: true,
  });

  if (!category) {
    return res.status(400).json({
      status: false,
      message: "category id not found",
    });
  }

  return res.status(200).json({
    status: true,
    message: "category updated successfully",
    category,
  });
});

// category list
export const categoryList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const pageNo = Number(req.params.pageNo) || 1;
  const perPage = Number(req.params.perPage) || 10;
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

  const category = await Category.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $count: "Total",
          },
        ],
        row: [
          {
            $skip: skip,
          },
          {
            $limit: perPage,
          },
        ],
      },
    },
  ]);
  return res
    .status(200)
    .json({ success: true, message: "Category fetch success", category });
});

// delete Category
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const objectId = new mongoose.Types.ObjectId(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid Category ID",
    });
  }

  const checkAssociate = await checkAssociateService(
    { categoryId: objectId },
    Product
  );
  if (checkAssociate) {
    return res.status(404).json({
      status: "associate",
      message: "Category is associated with a Product cannot be deleted",
    });
  }
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    return res
      .status(404)
      .json({ status: false, message: "Category Not Found" });
  }

  return res
    .status(200)
    .json({ status: true, message: "Delete Category Success", result });
});
