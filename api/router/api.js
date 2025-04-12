import express from "express";
import * as userController from "../controller/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

//user
router.post("/create-user", userController.registerUser);
router.post("/login-user", userController.loginUser);
router.post("/update-user", authMiddleware, userController.updateUser);
router.get("/authUser", authMiddleware, userController.authUser);
router.get("/logoutUser", authMiddleware, userController.logoutUser);
router.get("/verifyAccount", authMiddleware, userController.verifyEmailSendOtp);
router.post("/verifyOtp", authMiddleware, userController.verifyOtp);
router.post("/resetPassword", authMiddleware, userController.resetPassword);
router.get("/user", userController.getAllUsers);

export default router;
