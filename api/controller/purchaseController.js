import ParentPurchase from "../model/Purchase.js";
import ChildPurchase from "../model/PurchaseProduct.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

// get purchas
export const getAllPurchase = asyncHandler(async (req, res) => {
  const purchase = await ParentPurchase.find();
  if (!purchase || purchase.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No purchase Found" });
  }
  return res.status(200).json({
    success: true,
    message: "Purchase fetch success",
    purchase,
  });
});

// create Purchase
export const createPurchase = async (req, res) => {
  // create Transetion session
  const session = await mongoose.startSession();
  try {
    // start Transection
    await session.startTransaction();

    const { parentData, childData } = req.body;
    const { email } = req.user;

    const parentPayload = {
      ...parentData,
      userEmail: email,
    };

    const [parentCreated] = await ParentPurchase.create([parentPayload], {
      session,
    });

    // Second DataBase for purchaseProducts
    const childCreated = [];

    for (const item of childData) {
      const childPayload = {
        ...item,
        purchaseId: parentCreated._id,
        userEmail: email,
      };

      const [created] = await ChildPurchase.create([childPayload], {
        session,
      });
      childCreated.push(created);
    }

    // Transection Success
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      message: "purchase Created successfully",
      parent: parentCreated,
      children: childCreated,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      status: "faild",
      message: error.message,
    });
  }
};

// list purchase
export const purchaseList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const pageNo = Number(req.params.pageNo) || 1;
  const perPage = Number(req.params.perPage) || 5;
  const keyword = req.params.keyword || "";

  const skip = (pageNo - 1) * perPage;

  let matchStage = {
    userEmail: email,
  };

  const purchase = await ParentPurchase.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "suppliers",
        localField: "supplierId",
        foreignField: "_id",
        as: "supplier_Details",
      },
    },
    {
      $unwind: {
        path: "$supplier_Details",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        ...matchStage,
        ...(keyword &&
          keyword !== "0" && {
            $or: [
              { note: { $regex: keyword, $options: "i" } },
              { "supplier_Details.name": { $regex: keyword, $options: "i" } },
              {
                "supplier_Details.address": { $regex: keyword, $options: "i" },
              },
              {
                "supplier_Details.supplierEmail": {
                  $regex: keyword,
                  $options: "i",
                },
              },
            ],
          }),
      },
    },
    {
      $facet: {
        total: [{ $count: "count" }],
        purchase: [{ $skip: skip }, { $limit: perPage }],
      },
    },
  ]);

  const Total = purchase[0]?.total[0]?.count || 0;
  const purchaseLists = purchase[0]?.purchase || [];

  return res.status(200).json({
    success: true,
    message: "Purchase fetch success",
    data: {
      Total,
      purchases: purchaseLists,
    },
  });
});

// Delete Purchase
export const deletePurchase = async (req, res) => {
  // create Transetion session
  const session = await mongoose.startSession();
  try {
    // start Transection
    await session.startTransaction();
    const { id } = req.params;

    const parentPuchase = await ParentPurchase.findByIdAndDelete(
      {
        _id: id,
      },
      { session }
    );

    if (!parentPuchase) {
      return res.status(400).json({
        success: false,
        message: "Parent Purchase Not Found",
      });
    }

    // delete childs
    await ChildPurchase.deleteMany(
      {
        purchaseId: id,
      },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Purchase deleted successfully",
    });
  } catch (error) {
    // Abort the transaction in case of an error
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
