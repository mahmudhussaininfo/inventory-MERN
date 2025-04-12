import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import sendEmail from "../utils/email.js";
import bcrypt from "bcryptjs";
import { tokenEncode } from "../utils/token.js";
import { htmlContent, htmlContentOtp } from "../utils/emailTemplate.js";

// get all user
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (!users || users.length === 0) {
    return res.status(400).json({ success: false, message: "No User Found" });
  }
  return res
    .status(200)
    .json({ success: true, message: "user fetch success", users });
});

// register user
export const registerUser = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // check if all fields are present
  if (!email || !password || !firstName || !lastName) {
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
  });

  // send email
  const mail = await sendEmail(
    email,
    "Welcome to Inventory App",
    htmlContent(firstName, email, password)
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
  });
});

// login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if all fields are present
  if (!email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  // check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "user not found",
    });
  }

  // check if password is correct
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      status: false,
      message: "Invalid password",
    });
  }

  // generate token
  const token = tokenEncode(user.email);

  const options = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  // set cookie
  res.cookie("Token", token, options);

  // user response
  const userResponse = {
    firstName: user.firstName,
    email: user.email,
    photo: user.photo,
    mobile: user.mobile,
  };

  return res.status(200).json({
    status: true,
    message: "Login successful",
    token,
    user: userResponse,
  });
});

// auth user
export const authUser = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email }).select("firstName email mobile");
  if (!user) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
    });
  }
  return res.status(200).json({
    status: true,
    message: "LoggedIn User found",
    user,
  });
});

// update user
export const updateUser = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const reqBody = req.body;

  const user = await User.findOneAndUpdate({ email }, reqBody, {
    new: true,
  }).select("-password");

  return res.status(200).json({
    status: true,
    message: "User updated successfully",
    user,
  });
});

// verify Email and send otp
export const verifyEmailSendOtp = asyncHandler(async (req, res) => {
  const { email } = req.user;

  let otp = Math.floor(100000 + Math.random() * 900000);

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }

  // send email
  const mail = await sendEmail(
    email,
    "Otp for recover your Account",
    htmlContentOtp(user.firstName, user.email, otp)
  );
  if (!mail) {
    return res.status(500).json({
      status: false,
      message: "Email not sent",
    });
  }

  // update user
  user.otp = otp;
  await user.save();

  return res.status(200).json({
    status: true,
    message: "user verify successfully Check your email for otp",
  });
});

// verify otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "User not found",
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      status: false,
      message: "Invalid otp",
    });
  }

  // update user
  user.otp = 0;
  user.isVerified = true;
  await user.save();

  return res.status(200).json({
    status: true,
    message: "Otp verified successfully",
  });
});

// reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { password, newPassword } = req.body;

  // check if all fields are present
  if (!password || !newPassword) {
    return res.status(400).json({
      status: false,
      message: "Please fill all fields",
    });
  }

  const user = await User.findOne({ email });

  // check user verified or not
  if (!user.isVerified) {
    return res.status(400).json({
      success: false,
      message: "User not verified, Please verify your email first",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect Old Password" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await User.updateOne({ email }, { password: hashedPassword });

  // send email
  const mail = await sendEmail(
    email,
    "Password Updated Successfully",
    htmlContent(user.firstName, user.email, newPassword)
  );
  if (!mail) {
    return res.status(500).json({
      status: false,
      message: "Email not sent",
    });
  }

  return res
    .status(200)
    .json({ success: true, message: "Password updated successfully" });
});

// logout user with cookie clear
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("Token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully" });
});
