import Customer from "../model/Customer.js";
import asyncHandler from "express-async-handler";

// get all Customers
export const getAllCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.find().select("_id name");
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
