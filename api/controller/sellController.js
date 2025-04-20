import ParentSell from "../model/Sell.js";
import ChildSell from "../model/SellProduct.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

// get Sell
export const getAllSell = asyncHandler(async (req, res) => {
  const sell = await ParentSell.find();
  if (!sell || sell.length === 0) {
    return res.status(400).json({ success: false, message: "No Sell Found" });
  }
  return res.status(200).json({
    success: true,
    message: "Sell fetch success",
    sell,
  });
});

// create sell parant & child
export const createSell = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { parentData, childData } = req.body;
    const { email } = req.user;

    const parentPayload = {
      ...parentData,
      userEmail: email,
    };

    const [parentCreated] = await ParentSell.create([parentPayload], {
      session,
    });

    // second database for childSell
    const child = [];

    for (const items of childData) {
      const childPayload = {
        ...items,
        sellId: parentCreated._id,
        userEmail: email,
      };

      const [childCreated] = await ChildSell.create([childPayload], {
        session,
      });

      child.push(childCreated);
    }

    // Transection success
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      message: "sell Created successfully",
      parentSell: parentCreated,
      chilSell: child,
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

// list Sell
export const sellList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const pageNo = Number(req.params.pageNo) || 1;
  const perPage = Number(req.params.perPage) || 5;
  const keyword = req.params.keyword || "";

  const skip = (pageNo - 1) * perPage;

  let matchStage = {
    userEmail: email,
  };

  const sell = await ParentSell.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer_Details",
      },
    },
    {
      $unwind: {
        path: "$customer_Details",
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
              { "customer_Details.name": { $regex: keyword, $options: "i" } },
              {
                "customer_Details.address": { $regex: keyword, $options: "i" },
              },
              {
                "customer_Details.customerEmail": {
                  $regex: keyword,
                  $options: "i",
                },
              },
              {
                "customer_Details.mobile": {
                  $regex: keyword,
                },
              },
            ],
          }),
      },
    },
    {
      $facet: {
        total: [{ $count: "count" }],
        sell: [{ $skip: skip }, { $limit: perPage }],
      },
    },
  ]);

  const Total = sell[0]?.total[0]?.count || 0;
  const sellLists = sell[0]?.sell || [];

  return res.status(200).json({
    success: true,
    message: "sell fetch success",
    data: {
      Total,
      sellLists,
    },
  });
});

// Delete Sell
export const deleteSell = async (req, res) => {
  // create Transetion session
  const session = await mongoose.startSession();
  try {
    // start Transection
    await session.startTransaction();
    const { id } = req.params;

    const parentSell = await ParentSell.findByIdAndDelete(
      {
        _id: id,
      },
      { session }
    );

    if (!parentSell) {
      return res.status(400).json({
        success: false,
        message: "Parent Sell Not Found",
      });
    }

    // delete childs
    const childSell = await ChildSell.deleteMany(
      {
        sellId: id,
      },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Sell deleted successfully",
      parentSell,
      childSell,
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
