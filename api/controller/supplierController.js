import Supplier from "../model/Supplier.js";
import asyncHandler from "express-async-handler";

// get all suppliers
export const getAllsupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.find().select("_id name");
  if (!supplier || supplier.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No supplier Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "supplier fetch success", supplier });
});

// register Supplier
export const registerSupplier = asyncHandler(async (req, res) => {
  const { name, supplierEmail, mobile, address } = req.body;
  const { email } = req.user;

  // check if all fields are present
  if (!name || !supplierEmail || !mobile || !address) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if supplier exist
  const existingsupplier = await Supplier.findOne({
    $or: [
      {
        supplierEmail,
      },
      {
        mobile,
      },
    ],
  });
  if (existingsupplier) {
    return res.status(400).json({
      status: false,
      message: "supplier already exist",
    });
  }

  // create supplier
  const supplier = await Supplier.create({
    userEmail: email,
    name,
    supplierEmail,
    mobile,
    address,
  });

  return res.status(201).json({
    status: true,
    message: "supplier created successfully",
    supplier,
  });
});

// update supplier
export const updateSupply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;

  const supplier = await Supplier.findByIdAndUpdate({ _id: id }, reqBody, {
    new: true,
  });

  if (!supplier) {
    return res.status(400).json({
      status: false,
      message: "supplier id not found",
    });
  }

  return res.status(200).json({
    status: true,
    message: "Supplier updated successfully",
    supplier,
  });
});

// supplier list
export const supplierList = asyncHandler(async (req, res) => {
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
    }),
  };

  const [total, suppliers] = await Promise.all([
    Supplier.countDocuments(matchStage),
    Supplier.find(matchStage).skip(skip).limit(perPage),
  ]);

  return res.status(200).json({
    success: true,
    message: "Supplier fetch success",
    data: {
      total,
      suppliers,
    },
  });
});
