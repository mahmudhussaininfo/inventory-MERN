import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";

// get all Products
export const getAllProduct = asyncHandler(async (req, res) => {
  const product = await Product.find();

  if (!product || product.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No Product Found" });
  }
  return res.status(200).json({
    success: true,
    message: "Product fetch success",
    product,
  });
});

// register Product
export const registerProduct = asyncHandler(async (req, res) => {
  const { name, brandId, categoryId, unit, details } = req.body;
  const { email } = req.user;

  // check if all fields are present
  if (!name || !brandId || !categoryId) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if Product exist
  const existingProduct = await Product.findOne({
    name,
  });
  if (existingProduct) {
    return res.status(400).json({
      status: false,
      message: "Product already exist",
    });
  }

  // create Product
  const product = await Product.create({
    userEmail: email,
    name,
    details,
    unit,
    categoryId,
    brandId,
  });

  return res.status(201).json({
    status: true,
    message: "Product created successfully",
    product,
  });
});

// update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  const product = await Product.findByIdAndUpdate({ _id: id }, reqBody, {
    new: true,
  });

  if (!product) {
    return res.status(400).json({
      status: false,
      message: "Product id not found",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Product updated successfully",
    product,
  });
});

// Product list
export const ProductList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const pageNo = Number(req.params.pageNo) || 1;
  const perPage = Number(req.params.perPage) || 10;
  const keyword = req.params.keyword || "";

  const skip = (pageNo - 1) * perPage;

  let matchStage = {
    userEmail: email,
  };

  if (keyword && keyword !== "0") {
    matchStage && {
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          note: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    };
  }

  const [total, Products] = await Promise.all([
    Product.countDocuments(matchStage),
    Product.find(matchStage).populate("expanseId").skip(skip).limit(perPage),
  ]);

  return res.status(200).json({
    success: true,
    message: "Product fetch success",
    data: {
      total,
      Products,
    },
  });
});
