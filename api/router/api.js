import express from "express";
import * as userController from "../controller/userController.js";
import * as brandController from "../controller/brandController.js";
import * as categoryController from "../controller/categoryController.js";
import * as supplierController from "../controller/supplierController.js";
import * as customerController from "../controller/customerController.js";
import * as expanseTypeController from "../controller/expanseController.js";
import * as expanseDataController from "../controller/expanseDataController.js";
import * as productController from "../controller/productController.js";
import * as purchaseController from "../controller/purchaseController.js";
import * as sellController from "../controller/sellController.js";
import * as returnController from "../controller/returnController.js";
import authMiddleware from "../middleware/authMiddleware.js";

/**
 * router init
 */

const router = express.Router();

// ================================== user ====================================
router.post("/create-user", userController.registerUser);
router.post("/login-user", userController.loginUser);
router.post("/update-user", authMiddleware, userController.updateUser);
router.get("/authUser", authMiddleware, userController.authUser);
router.get("/logoutUser", authMiddleware, userController.logoutUser);
router.get("/verifyAccount", authMiddleware, userController.verifyEmailSendOtp);
router.post("/verifyOtp", authMiddleware, userController.verifyOtp);
router.post("/resetPassword", authMiddleware, userController.resetPassword);
router.get("/user", userController.getAllUsers);

// ================================== brands ==================================
router.get("/brands", authMiddleware, brandController.getAllBrands);
router.get(
  "/brands/:pageNo/:perPage/:keyword?",
  authMiddleware,
  brandController.brandList
);
router.post("/create-brand", authMiddleware, brandController.registerBrand);
router.post("/updateBrand/:id", authMiddleware, brandController.updateBrand);
router.delete("/brand-delete/:id", authMiddleware, brandController.deleteBrand);

// ================================== category ====================================
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
router.delete(
  "/delete-category/:id",
  authMiddleware,
  categoryController.deleteCategory
);

// ============================= supplier ======================================
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
router.delete(
  "/delete-supplier/:id",
  authMiddleware,
  supplierController.deleteSupplier
);

// ==================================== customer ==================================
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
router.delete(
  "/delete-customer/:id",
  authMiddleware,
  customerController.deleteCustomer
);

// =============================== expanse Type ===================================
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

// ==================================== expanse Data ================================
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

// ================================= Product =========================================
router.get("/products", authMiddleware, productController.getAllProduct);
router.post(
  "/create-product",
  authMiddleware,
  productController.registerProduct
);
router.post(
  "/updateProduct/:id",
  authMiddleware,
  productController.updateProduct
);
router.get(
  "/products/:pageNo/:perPage/:keyword",
  authMiddleware,
  productController.ProductList
);

// ========================== Hybrid PurChase ===================================
router.get("/purchases", authMiddleware, purchaseController.getAllPurchase);
router.delete(
  "/purchase-delete/:id",
  authMiddleware,
  purchaseController.deletePurchase
);
router.post(
  "/create-purchase",
  authMiddleware,
  purchaseController.createPurchase
);
router.get(
  "/purchase/:pageNo/:perPage/:keyword",
  authMiddleware,
  purchaseController.purchaseList
);
router.delete(
  "/purchase-delete/:id",
  authMiddleware,
  purchaseController.deletePurchase
);

//======================= hybrid sell =================================
router.get("/sell", authMiddleware, sellController.getAllSell);
router.post("/create-sell", authMiddleware, sellController.createSell);
router.get(
  "/sell/:pageNo/:perPage/:keyword",
  authMiddleware,
  sellController.sellList
);
router.delete("/sell-delete/:id", authMiddleware, sellController.deleteSell);

//======================= hybrid return =================================
router.get("/return", authMiddleware, returnController.getAllReturn);
router.post("/create-return", authMiddleware, returnController.createReturn);
router.get(
  "/return/:pageNo/:perPage/:keyword",
  authMiddleware,
  returnController.returnDataList
);
router.delete(
  "/return-delete/:id",
  authMiddleware,
  returnController.deleteReturn
);

export default router;
