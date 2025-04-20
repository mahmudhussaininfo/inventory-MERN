import ParentReturn from "../model/ReturnData.js";
import ChildReturn from "../model/ReturnProductData.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

// get Return
export const getAllReturn = asyncHandler(async (req, res) => {
  const returnData = await ParentReturn.find();
  if (!returnData || returnData.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No ReturnData Found" });
  }
  return res.status(200).json({
    success: true,
    message: "ReturnData fetch success",
    returnData,
  });
});

// create Return parant & child
export const createReturn = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { parentData, childData } = req.body;
    const { email } = req.user;

    const parentPayload = {
      ...parentData,
      userEmail: email,
    };

    const [parentCreated] = await ParentReturn.create([parentPayload], {
      session,
    });

    // second database for childReturn
    const child = [];

    for (const item of childData) {
      const childPayload = {
        ...item,
        returnId: parentCreated._id,
        userEmail: email,
      };

      const [childCreated] = await ChildReturn.create([childPayload], {
        session,
      });

      child.push(childCreated);
    }

    // Transection success
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      message: "Return Created successfully",
      parentReturn: parentCreated,
      childReturn: child,
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

// list Return
export const returnDataList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const pageNo = Number(req.params.pageNo) || 1;
  const perPage = Number(req.params.perPage) || 5;
  const keyword = req.params.keyword || "";

  const skip = (pageNo - 1) * perPage;

  let matchStage = {
    userEmail: email,
  };

  const returnData = await ParentReturn.aggregate([
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
        returnData: [{ $skip: skip }, { $limit: perPage }],
      },
    },
  ]);

  const Total = returnData[0]?.total[0]?.count || 0;
  const returnDataLists = returnData[0]?.returnData || [];

  return res.status(200).json({
    success: true,
    message: "ReturnData list fetch success",
    data: {
      Total,
      returnDataLists,
    },
  });
});

// Delete Retrun
export const deleteReturn = async (req, res) => {
  // create Transetion session
  const session = await mongoose.startSession();
  try {
    // start Transection
    await session.startTransaction();
    const { id } = req.params;

    const parentReturn = await ParentReturn.findByIdAndDelete(
      {
        _id: id,
      },
      { session }
    );

    if (!parentReturn) {
      return res.status(400).json({
        success: false,
        message: "Parent Return Not Found",
      });
    }

    // delete childs
    const childReturn = await ChildReturn.deleteMany(
      {
        returnId: id,
      },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Return deleted successfully",
      parentReturn,
      childReturn,
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
