import asyncHandler from "express-async-handler";
import ExpanseData from "./../model/ExpanseData.js";

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
