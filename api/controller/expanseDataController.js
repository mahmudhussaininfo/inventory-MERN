import ExpanseData from "../model/ExpanseData.js";
import asyncHandler from "express-async-handler";

// get all expanseDatas
export const getAllexpanseData = asyncHandler(async (req, res) => {
  const expanseData = await ExpanseData.aggregate([
    {
      $lookup: {
        from: "expansetypes",
        localField: "expanseId",
        foreignField: "_id",
        as: "expanseDetails",
      },
    },
    {
      $unwind: {
        path: "$expanseDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        amount: 1,
        note: 1,
        "expanseDetails._id": 1,
        "expanseDetails.name": 1,
      },
    },
  ]);

  if (!expanseData || expanseData.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No expanseData Found" });
  }
  return res.status(200).json({
    success: true,
    message: "expanseData fetch success",
    expanseData,
  });
});

// register expanseData
export const registerexpanseData = asyncHandler(async (req, res) => {
  const { name, amount, note, expanseId } = req.body;
  const { email } = req.user;

  // check if all fields are present
  if (!name || !amount || !note) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if expanseData exist
  const existingExpanseData = await ExpanseData.findOne({
    name,
  });
  if (existingExpanseData) {
    return res.status(400).json({
      status: false,
      message: "expanseData already exist",
    });
  }

  // create expanseData
  const expanseData = await ExpanseData.create({
    userEmail: email,
    name,
    amount,
    note,
    expanseId,
  });

  return res.status(201).json({
    status: true,
    message: "expanseData created successfully",
    expanseData,
  });
});

// update expanseData
export const updateExpanseData = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  const expanseData = await expanseData.findByIdAndUpdate(
    { _id: id },
    reqBody,
    {
      new: true,
    }
  );

  if (!expanseData) {
    return res.status(400).json({
      status: false,
      message: "expanseData id not found",
    });
  }

  return res.status(200).json({
    status: true,
    message: "expanseData updated successfully",
    expanseData,
  });
});

// expanseData list
export const expanseDataList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const pageNo = Number(req.params.pageNo) || 1;
  const perPage = Number(req.params.perPage) || 10;
  const keyword = req.params.keyword || "";

  const skip = (pageNo - 1) * perPage;

  const matchStage = {
    userEmail: email,
    ...(keyword && {
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
    }),
  };

  const [total, expanseDatas] = await Promise.all([
    ExpanseData.countDocuments(matchStage),
    ExpanseData.find(matchStage)
      .populate("expanseId")
      .skip(skip)
      .limit(perPage),
  ]);

  return res.status(200).json({
    success: true,
    message: "expanseData fetch success",
    data: {
      total,
      expanseDatas,
    },
  });
});
