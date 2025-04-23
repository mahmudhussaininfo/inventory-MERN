import asyncHandler from "express-async-handler";
import Sell from "../model/Sell.js";
import ExpanseData from "../model/ExpanseData.js";
import Purchase from "../model/Purchase.js";
import Return from "../model/ReturnData.js";

// sales Saummary
export const salesSummary = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const summary = await Sell.aggregate([
    {
      $match: {
        userEmail: email,
      },
    },

    {
      $facet: {
        Total: [
          {
            $group: {
              _id: null,
              TotalAmount: { $sum: "$grandTotal" },
            },
          },
        ],
        last30Days: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%d-%m-%Y",
                  date: "$createdAt",
                },
              },
              TotalAmount: { $sum: "$grandTotal" },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 30 },
        ],
      },
    },
  ]);

  return res.status(200).json({
    status: true,
    message: "Sell Summary Success",
    summary: summary[0],
  });
});

// expanse Summary
export const expanseSummary = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const matchStage = {
    userEmail: email,
  };

  const dateEasy = {
    $dateToString: {
      format: "%d-%m-%Y",
      date: "$createdAt",
    },
  };

  const summary = await ExpanseData.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $group: {
              _id: null,
              TotalAmount: { $sum: "$amount" },
            },
          },
        ],
        last30Days: [
          {
            $group: {
              _id: dateEasy,
              TotalAmount: { $sum: "$amount" },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 30,
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: true,
    message: "expanse Summary fetch Success",
    summary: summary[0],
  });
});

// Purchase Summary
export const purchaseSummary = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const matchStage = {
    userEmail: email,
  };

  const summary = await Purchase.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $group: {
              _id: null,
              TotalAmount: { $sum: "$grandTotal" },
            },
          },
        ],
        last30Days: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%d-%m-%Y",
                  date: "$createdAt",
                },
              },
              TotalAmount: { $sum: "$grandTotal" },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 30,
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: true,
    message: "purchase Summary fetch Success",
    summary: summary[0],
  });
});

// return Summary
export const returnSummary = asyncHandler(async (req, res) => {
  const { email } = req.user;

  const matchStage = {
    userEmail: email,
  };

  const summary = await Return.aggregate([
    {
      $match: matchStage,
    },
    {
      $facet: {
        Total: [
          {
            $group: {
              _id: null,
              TotalAmount: { $sum: "$grandTotal" },
            },
          },
        ],
        last30Days: [
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%d-%m-%Y",
                  date: "$createdAt",
                },
              },
              TotalAmount: { $sum: "$grandTotal" },
            },
          },
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $limit: 30,
          },
        ],
      },
    },
  ]);

  res.status(200).json({
    status: true,
    message: "Return Summary fetch Success",
    summary: summary[0],
  });
});
