import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/email.js";
import bcrypt from "bcryptjs";
import { tokenEncode } from "../utils/token.js";

// register user
export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, mobile } = req.body;

  // check if all fields are present
  if (!email || !password || !firstName || !lastName || !mobile) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if user exist
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      status: false,
      message: "User already exist",
    });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create User
  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    mobile,
  });

  // send email
  const mail = await sendEmail(
    email,
    "Welcome to Inventory App",
    `Hello ${firstName}, welcome to Inventory App. Your account has been created successfully.`
  );
  if (!mail) {
    return res.status(500).json({
      status: false,
      message: "Email not sent",
    });
  }

  return res.status(201).json({
    status: true,
    message: "User created successfully",
    user,
    mail,
  });
});
