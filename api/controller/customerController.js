import mongoose from "mongoose";
import Customer from "../model/Customer.js";
import asyncHandler from "express-async-handler";
import { checkAssociateService } from "../services/checkAssociateService.js";
import Sell from "../model/Sell.js";

// get all Customers
export const getAllCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.find();
  if (!customer || customer.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No Customer Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Customer fetch success", customer });
});

// register Customer
export const registerCustomer = asyncHandler(async (req, res) => {
  const { name, customerEmail, mobile, address } = req.body;
  const { email } = req.user;

  // check if all fields are present
  if (!name || !customerEmail || !mobile || !address) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if Customer exist
  const existingCustomer = await Customer.findOne({
    $or: [
      {
        customerEmail,
      },
      {
        mobile,
      },
    ],
  });
  if (existingCustomer) {
    return res.status(400).json({
      status: false,
      message: "Customer already exist",
    });
  }

  // create Customer
  const customer = await Customer.create({
    userEmail: email,
    name,
    customerEmail,
    mobile,
    address,
  });

  return res.status(201).json({
    status: true,
    message: "Customer created successfully",
    customer,
  });
});

// update Customer
export const updateCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  const customer = await Customer.findByIdAndUpdate({ _id: id }, reqBody, {
    new: true,
  });

  if (!customer) {
    return res.status(400).json({
      status: false,
      message: "Customer id not found",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Customer updated successfully",
    customer,
  });
});

// customer listing
export const customerList = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const perPage = Number(req.params.perPage) || 1;
  const pageNo = Number(req.params.pageNo) || 10;
  const keyword = req.params.keyword || "";

  const skip = (pageNo - 1) * perPage;

  let matchStage = {
    userEmail: email,
  };

  if (keyword && keyword !== "0") {
    matchStage = {
      ...matchStage,
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          address: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: keyword,
          },
        },
      ],
    };
  }

  const [total, customers] = await Promise.all([
    Customer.countDocuments(matchStage),
    Customer.find(matchStage).skip(skip).limit(perPage),
  ]);

  return res.status(200).json({
    success: true,
    message: "customers fetch success",
    data: {
      total,
      customers,
    },
  });
});

// customer Delete
export const deleteCustomer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const objectId = new mongoose.Types.ObjectId(id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid Category ID",
    });
  }

  const checkAssociate = await checkAssociateService(
    { customerId: objectId },
    Sell
  );
  if (checkAssociate) {
    return res.status(404).json({
      status: "associate",
      message: "Customer is associated with a Sell cannot be deleted",
    });
  }
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) {
    return res
      .status(404)
      .json({ status: false, message: "Customer Not Found" });
  }

  return res
    .status(200)
    .json({ status: true, message: "Delete Customer Success", customer });
});
