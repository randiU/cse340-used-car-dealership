import express from "express";
import { homePage } from "./index.js";
import { buildVehicleInventoryPage, buildVehicleDetailPage, buildCategoryVehiclePage } from "./inventoryController.js";
import { showContactForm, handleContactSubmission } from "./contactController.js";
import { contactValidation } from "../middleware/validation.js";
import {
  showRegistrationForm,
  processRegistration,
  showLoginForm,
  processLogin,
  processLogout
} from "./accountController.js";



const router = express.Router();

// Middleware to add page-specific styles/scripts
router.use("/vehicles", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/browse.css">');
  next();
});

router.use("/contact", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/contact.css">');
  next();
});


//Home page route
router.get("/", homePage);

//Inventory Routes
router.get("/vehicles", buildVehicleInventoryPage);
router.get("/vehicles/category/:slug", buildCategoryVehiclePage);
router.get("/vehicles/:slug", buildVehicleDetailPage);

//Contact Routes
router.get("/contact", showContactForm);
router.post("/contact", contactValidation, handleContactSubmission);

//Registration Routes
router.get("/register", showRegistrationForm);
router.post("/register", processRegistration);

//Login Routes
router.get("/login", showLoginForm);
router.post("/login", processLogin);
router.get("/logout", processLogout);

//Temporary route for dashboard until it's been created
router.get("/dashboard", (req, res) => {
  res.render("account/dashboard", {
    title: "Dashboard"
  });
});



//Test route for 500 error
router.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error"));
});

export default router;