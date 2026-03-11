import express from "express";
import { homePage } from "./index.js";
import { buildVehicleInventoryPage, buildVehicleDetailPage, buildCategoryVehiclePage } from "./inventoryController.js";

const router = express.Router();

// Middleware to add page-specific styles/scripts
router.use("/vehicles", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/browse.css">');
  next();
});


//Home page route
router.get("/", homePage);

//Inventory Routes
router.get("/vehicles", buildVehicleInventoryPage);
router.get("/vehicles/category/:slug", buildCategoryVehiclePage);
router.get("/vehicles/:slug", buildVehicleDetailPage);

//Test route for 500 error
router.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error"));
});

export default router;