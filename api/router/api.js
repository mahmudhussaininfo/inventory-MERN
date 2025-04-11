import express from "express";
import * as userController from "../controller/userController.js";

const router = express.Router();

//user
router.post("/create-user", userController.registerUser);

export default router;
