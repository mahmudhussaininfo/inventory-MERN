import express from "express";
import * as userController from "../controller/userController.js";
import * as brandController from "../controller/brandController.js";
import * as categoryController from "../controller/categoryController.js";
import * as supplierController from "../controller/supplierController.js";
import * as customerController from "../controller/customerController.js";
import * as expanseTypeController from "../controller/expanseController.js";
import * as expanseDataController from "../controller/expanseDataController.js";
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

// brands
router.get("/brands", authMiddleware, brandController.getAllBrands);
router.get(
  "/brands/:pageNo/:perPage/:keyword",
  authMiddleware,
  brandController.brandList
);
router.post("/create-brand", authMiddleware, brandController.registerBrand);
router.post("/updateBrand/:id", authMiddleware, brandController.updateBrand);

// category
router.get("/category", authMiddleware, categoryController.getAllCategory);
router.post(
  "/create-category",
  authMiddleware,
  categoryController.registerCategory
);
router.post(
  "/updateCategory/:id",
  authMiddleware,
  categoryController.updateCategory
);
router.get(
  "/category/:pageNo/:perPage/:keyword",
  authMiddleware,
  categoryController.categoryList
);

// supplier
router.get("/suppliers", authMiddleware, supplierController.getAllsupplier);
router.get(
  "/supplier/:pageNo/:perPage/:keyword",
  authMiddleware,
  supplierController.supplierList
);
router.post(
  "/create-supplier",
  authMiddleware,
  supplierController.registerSupplier
);
router.post(
  "/updateSupply/:id",
  authMiddleware,
  supplierController.updateSupply
);

// customer
router.get("/customers", authMiddleware, customerController.getAllCustomer);
router.post(
  "/create-customer",
  authMiddleware,
  customerController.registerCustomer
);
router.post(
  "/updateCustomer/:id",
  authMiddleware,
  customerController.updateCustomer
);
router.get(
  "/customer/:pageNo/:perPage/:keyword",
  authMiddleware,
  customerController.customerList
);

// expanse Type
router.get(
  "/expanseTypes",
  authMiddleware,
  expanseTypeController.getAllExpanseType
);
router.post(
  "/create-expanseType",
  authMiddleware,
  expanseTypeController.registerExpanseType
);
router.post(
  "/updateExpanseType/:id",
  authMiddleware,
  expanseTypeController.updateExpanseType
);
router.get(
  "/expanseType/:pageNo/:perPage/:keyword",
  authMiddleware,
  expanseTypeController.expanseTypeList
);

// expanse Data
router.get(
  "/expanseData",
  authMiddleware,
  expanseDataController.getAllexpanseData
);
router.post(
  "/create-expanseData",
  authMiddleware,
  expanseDataController.registerexpanseData
);
router.post(
  "/updateExpanseData/:id",
  authMiddleware,
  expanseDataController.updateExpanseData
);
router.get(
  "/expanseData/:pageNo/:perPage/:keyword",
  authMiddleware,
  expanseDataController.expanseDataList
);
export default router;
