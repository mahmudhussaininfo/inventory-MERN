import Brand from "../model/Brand.js";
import asyncHandler from "express-async-handler";

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

// update user
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
