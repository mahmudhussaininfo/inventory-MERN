import asyncHandler from "express-async-handler";
import ExpanseData from "./../model/ExpanseData.js";
import PurchaseProduct from "./../model/PurchaseProduct.js";
import SellProduct from "../model/SellProduct.js";
import ReturnProduct from "../model/ReturnProductData.js";

// expnase Report
export const expanseReport = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { formDate, toDate } = req.body;

  if (!formDate || !toDate) {
    return res.status(404).json({
      status: false,
      message: "Form Data && To Data is required",
    });
  }

  // Normalize dates
  const startDate = new Date(`${formDate}T00:00:00.000Z`);
  const endDate = new Date(`${toDate}T23:59:59.999Z`);

  // match Stage
  const matchStage = {
    userEmail: email,
    createdDate: { $gte: startDate, $lte: endDate },
  };

  const data = await ExpanseData.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $group: {
              _id: 0,
              totalAmount: { $sum: "$amount" },
            },
          },
        ],
        Rows: [
          {
            $lookup: {
              from: "expansetypes",
              localField: "expanseId",
              foreignField: "_id",
              as: "Type",
            },
          },
          {
            $unwind: {
              path: "$Type",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    status: true,
    message: "expanse Report Success",
    data: data[0],
  });
});

// purchase Report
export const purchaseReport = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { formDate, toDate } = req.body;

  if (!formDate || !toDate) {
    return res.status(404).json({
      status: false,
      message: "Form Data && To Data is required",
    });
  }

  // Normalize dates
  const startDate = new Date(`${formDate}T00:00:00.000Z`);
  const endDate = new Date(`${toDate}T23:59:59.999Z`);

  // match Stage
  const matchStage = {
    userEmail: email,
    createdDate: { $gte: startDate, $lte: endDate },
  };

  const data = await PurchaseProduct.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $group: {
              _id: 0,
              totalAmount: { $sum: "$total" },
            },
          },
        ],
        Rows: [
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "Product_Details",
            },
          },
          {
            $unwind: {
              path: "$Product_Details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "brands",
              localField: "Product_Details.brandId",
              foreignField: "_id",
              as: "Brands",
            },
          },
          {
            $unwind: "$Brands",
          },
          {
            $lookup: {
              from: "categories",
              localField: "Product_Details.categoryId",
              foreignField: "_id",
              as: "Category",
            },
          },
          {
            $unwind: "$Category",
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    status: true,
    message: "puchase Report Success",
    data: data[0],
  });
});

// sales Report
export const salesReport = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { formDate, toDate } = req.body;

  if (!formDate || !toDate) {
    return res.status(404).json({
      status: false,
      message: "Form Data && To Data is required",
    });
  }

  // Normalize dates
  const startDate = new Date(`${formDate}T00:00:00.000Z`);
  const endDate = new Date(`${toDate}T23:59:59.999Z`);

  // match Stage
  const matchStage = {
    userEmail: email,
    createdDate: { $gte: startDate, $lte: endDate },
  };

  const data = await SellProduct.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $group: {
              _id: 0,
              totalAmount: { $sum: "$total" },
            },
          },
        ],
        Rows: [
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "Product_Details",
            },
          },
          {
            $unwind: {
              path: "$Product_Details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "brands",
              localField: "Product_Details.brandId",
              foreignField: "_id",
              as: "Brands",
            },
          },
          {
            $unwind: "$Brands",
          },
          {
            $lookup: {
              from: "categories",
              localField: "Product_Details.categoryId",
              foreignField: "_id",
              as: "Category",
            },
          },
          {
            $unwind: "$Category",
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    status: true,
    message: "sales Report Success",
    data: data[0],
  });
});

// return Report
export const returnReport = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { formDate, toDate } = req.body;

  if (!formDate || !toDate) {
    return res.status(404).json({
      status: false,
      message: "Form Data && To Data is required",
    });
  }

  // Normalize dates
  const startDate = new Date(`${formDate}T00:00:00.000Z`);
  const endDate = new Date(`${toDate}T23:59:59.999Z`);

  // match Stage
  const matchStage = {
    userEmail: email,
    createdDate: { $gte: startDate, $lte: endDate },
  };

  const data = await ReturnProduct.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $group: {
              _id: 0,
              totalAmount: { $sum: "$total" },
            },
          },
        ],
        Rows: [
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "Product_Details",
            },
          },
          {
            $unwind: {
              path: "$Product_Details",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "brands",
              localField: "Product_Details.brandId",
              foreignField: "_id",
              as: "Brands",
            },
          },
          {
            $unwind: "$Brands",
          },
          {
            $lookup: {
              from: "categories",
              localField: "Product_Details.categoryId",
              foreignField: "_id",
              as: "Category",
            },
          },
          {
            $unwind: "$Category",
          },
        ],
      },
    },
  ]);

  return res.status(200).json({
    status: true,
    message: "Return Report Success",
    data: data[0],
  });
});
