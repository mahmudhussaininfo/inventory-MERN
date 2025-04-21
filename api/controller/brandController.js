import Brand from "../model/Brand.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { checkAssociateService } from "../services/checkAssociateService.js";
import Product from "../model/Product.js";

// get all Brands
export const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().select("_id name");
  if (!brands || brands.length === 0) {
    return res.status(400).json({ success: false, message: "No Brand Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Brand fetch success", brands });
});

// register Brand
export const registerBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { email } = req.user;

  // check if all fields are present
  if (!name) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if user exist
  const existingBrand = await Brand.findOne({ name });
  if (existingBrand) {
    return res.status(400).json({
      status: false,
      message: "Brand already exist",
    });
  }

  // create Brand
  const brand = await Brand.create({
    userEmail: email,
    name,
  });

  return res.status(201).json({
    status: true,
    message: "Brand created successfully",
    brand,
  });
});

// update brand
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  const brand = await Brand.findByIdAndUpdate({ _id: id }, reqBody, {
    new: true,
  });

  if (!brand) {
    return res.status(400).json({
      status: false,
      message: "Brand id not found",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Brand updated successfully",
    brand,
  });
});

// brand list
export const brandList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const pageNo = Number(req.params.pageNo) || 1;
  const perPage = Number(req.params.perPage) || 10;
  const keyword = req.params.keyword || "";
  const skip = (pageNo - 1) * perPage;

  let matchCondition = {
    userEmail: email,
  };

  if (keyword && keyword !== "0") {
    matchCondition.name = {
      $regex: keyword,
      $options: "i",
    };
  }

  const brands = await Brand.aggregate([
    {
      $match: matchCondition,
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
    .json({ success: true, message: "Brand fetch success", brands });
});

// delete Brand
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const objectId = new mongoose.Types.ObjectId(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid Brand ID",
    });
  }

  const checkAssociate = await checkAssociateService(
    { brandId: objectId },
    Product
  );
  if (checkAssociate) {
    return res.status(404).json({
      status: "associate",
      message: "Brand is associated with a Product cannot be deleted",
    });
  }
  const result = await Brand.findByIdAndDelete(id);
  if (!result) {
    return res.status(404).json({ status: false, message: "Brand Not Found" });
  }

  return res
    .status(200)
    .json({ status: true, message: "Delete Brand Success", result });
});
