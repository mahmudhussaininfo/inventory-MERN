import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { checkAssociateService } from "../services/checkAssociateService.js";
import ReturnProduct from "../model/ReturnProductData.js";
import PurchaseProduct from "../model/PurchaseProduct.js";
import SellProduct from "../model/SellProduct.js";

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

// productDetail BY ID
export const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "product id not Valid" });
  }
  const product = await Product.findById(id);
  if (!product || product.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No Product Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Product id fetch success", product });
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

  const products = await Product.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        as: "brand",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$brand",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $match: {
        ...matchStage,
        ...(keyword &&
          keyword !== "0" && {
            $or: [
              { name: { $regex: keyword, $options: "i" } },
              { unit: { $regex: keyword, $options: "i" } },
              { details: { $regex: keyword, $options: "i" } },
              { "category.name": { $regex: keyword, $options: "i" } },
              { "brand.name": { $regex: keyword, $options: "i" } },
            ],
          }),
      },
    },
    {
      $facet: {
        total: [{ $count: "count" }],
        products: [{ $skip: skip }, { $limit: perPage }],
      },
    },
  ]);

  const total = products[0]?.total[0]?.count || 0;
  const productList = products[0]?.products || [];

  return res.status(200).json({
    success: true,
    message: "Product fetch success",
    data: {
      total,
      products: productList,
    },
  });
});

// delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid Product ID",
    });
  }

  const objectId = new mongoose.Types.ObjectId(id);

  const checkReturnAssociate = await checkAssociateService(
    { productId: objectId },
    ReturnProduct
  );
  const checkPurchaseAssociate = await checkAssociateService(
    { productId: objectId },
    PurchaseProduct
  );
  const checkSellAssociate = await checkAssociateService(
    { productId: objectId },
    SellProduct
  );

  if (checkReturnAssociate || checkPurchaseAssociate || checkSellAssociate) {
    return res.status(409).json({
      status: "associate",
      message:
        "Product is associated with a Return, Purchase or Sell cannot be deleted",
    });
  }
  const result = await Product.findByIdAndDelete(id);
  if (!result) {
    return res
      .status(404)
      .json({ status: false, message: "Procuct Not Found" });
  }

  return res
    .status(200)
    .json({ status: true, message: "Delete Product Success", result });
});
