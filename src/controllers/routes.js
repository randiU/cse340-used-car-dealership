import express from "express";
import { homePage } from "./index.js";
import {
  buildVehicleInventoryPage,
  buildVehicleDetailPage,
  buildCategoryVehiclePage,
  postReview,
  updateReview,
  deleteReview
} from "./inventoryController.js";
import { showContactForm, handleContactSubmission, showContactMessages, deleteContactMessageById } from "./contactController.js";
import { contactValidation, registrationValidation, loginValidation, serviceRequestValidation } from "../middleware/validation.js";
import {
  showRegistrationForm,
  processRegistration,
  showLoginForm,
  processLogin,
  processLogout,
} from "./accountController.js";
import { requireLogin, requireEmployee, requireAdmin } from "../middleware/auth.js";
import { handleAddUserVehicle } from "./userVehicleController.js";
import {
  showRoleDashboard,
  showUserDashboard,
  showEmployeeDashboard,
  showAdminDashboard
} from "./dashboardController.js";
import {
  showServiceRequestForm,
  handleServiceRequestSubmission,
  showUserServiceHistory,
  showAllServiceRequests,
  updateServiceRequestStatusById,
  updateServiceRequestNotesById
} from "./serviceController.js";

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

// Home page route
router.get("/", homePage);

// Inventory Routes
router.get("/vehicles", buildVehicleInventoryPage);
router.get("/vehicles/category/:slug", buildCategoryVehiclePage);
router.get("/vehicles/:slug", buildVehicleDetailPage);

// Vehicle review routes
router.get("/vehicles", buildVehicleInventoryPage);
router.get("/vehicles/category/:slug", buildCategoryVehiclePage);
router.get("/vehicles/:slug", buildVehicleDetailPage);

router.post("/vehicles/:slug/reviews", requireLogin, postReview);
router.post("/vehicles/:slug/reviews/:reviewId/update", requireLogin, updateReview);
router.post("/vehicles/:slug/reviews/:reviewId/delete", requireLogin, deleteReview);


// Contact Routes
router.get("/contact", showContactForm);
router.post("/contact", contactValidation, handleContactSubmission);

// Registration Routes
router.get("/register", showRegistrationForm);
router.post("/register", registrationValidation, processRegistration);

// Login Routes
router.get("/login", showLoginForm);
router.post("/login", loginValidation, processLogin);
router.get("/logout", processLogout);

// Dashboard Routes
router.get("/dashboard", requireLogin, showRoleDashboard);
router.get("/employee", requireEmployee, showEmployeeDashboard);
router.get("/admin", requireAdmin, showAdminDashboard);

// Admin Routes
router.get("/admin/contact-messages", requireEmployee, showContactMessages);
router.post("/admin/contact-messages/:messageId/delete", requireEmployee, deleteContactMessageById);

// User Vehicle action route
router.post("/my-vehicles/add", requireLogin, handleAddUserVehicle);

// Service Request Routes
router.get("/service/request", requireLogin, showServiceRequestForm);
router.post("/service/request", requireLogin, serviceRequestValidation, handleServiceRequestSubmission);
router.get("/service/history", requireLogin, showUserServiceHistory);
//Employee/admin routes for updating service request status
router.get("/employee/service-requests", requireEmployee, showAllServiceRequests);
router.post("/employee/service-requests/:requestId/status", requireEmployee, updateServiceRequestStatusById);
// Route to update service request notes
router.post("/employee/service-requests/:requestId/notes", requireEmployee, updateServiceRequestNotesById);

// Test route for 500 error
router.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error"));
});

export default router;