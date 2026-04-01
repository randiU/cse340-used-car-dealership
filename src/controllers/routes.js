//AI assisted with route order and organization.

import express from "express";
import { homePage } from "./index.js";
import {
  buildVehicleInventoryPage,
  buildVehicleDetailPage,
  buildCategoryVehiclePage,
  postReview,
  updateReview,
  deleteReview,
  showVehicleManagementPage,
  showAddVehicleForm,
  handleAddVehicle,
  showEditVehicleForm,
  handleUpdateVehicle,
  handleDeleteVehicle,
  showCategoryManagementPage,
  showAddCategoryForm,
  handleAddCategory,
  showEditCategoryForm,
  handleUpdateCategory,
  handleDeleteCategory
} from "./inventoryController.js";
import {
  showContactForm,
  handleContactSubmission,
  showContactMessages,
  deleteContactMessageById
} from "./contactController.js";
import {
  contactValidation,
  registrationValidation,
  loginValidation,
  serviceRequestValidation,
  vehicleValidation,
  categoryValidation,
  userVehicleValidation
} from "../middleware/validation.js";
import {
  showRegistrationForm,
  processRegistration,
  showLoginForm,
  processLogin,
  processLogout,
  showEmployeeAccounts,
  updateEmployeeRole
} from "./accountController.js";
import { requireLogin, requireEmployee, requireAdmin } from "../middleware/auth.js";
import {
  handleAddUserVehicle,
  showEditUserVehicleForm,
  handleUpdateUserVehicle,
  handleDeleteUserVehicle
} from "./userVehicleController.js";
import {
  showRoleDashboard,
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
import { showSystemOverview } from "./systemController.js";

const router = express.Router();

/* ================================
   PAGE-SPECIFIC STYLES
   ================================ */

// Vehicles browse/details pages
router.use("/vehicles", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/browse.css">');
  next();
});

// Contact page
router.use("/contact", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
  next();
});

// Dashboard-related pages
router.use("/dashboard", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  next();
});

router.use("/admin", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  next();
});

router.use("/employee", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  next();
});

router.use("/system", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  next();
});

// Home page
router.get(
  "/",
  (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/home.css">');
    next();
  },
  homePage
);

/* ================================
   VEHICLE ROUTES
   ================================ */
router.get("/vehicles", buildVehicleInventoryPage);
router.get("/vehicles/category/:slug", buildCategoryVehiclePage);
router.get("/vehicles/:slug", buildVehicleDetailPage);

/* ================================
   REVIEW ROUTES
   ================================ */
router.post("/vehicles/:slug/reviews", requireLogin, postReview);
router.post("/vehicles/:slug/reviews/:reviewId/update", requireLogin, updateReview);
router.post("/vehicles/:slug/reviews/:reviewId/delete", requireLogin, deleteReview);

/* ================================
   EMPLOYEE INVENTORY MANAGEMENT
   ================================ */
router.get("/employee/vehicles", requireEmployee, showVehicleManagementPage);
router.get("/employee/vehicles/:vehicleId/edit", requireEmployee, showEditVehicleForm);
router.post(
  "/employee/vehicles/:vehicleId/edit",
  requireEmployee,
  vehicleValidation,
  handleUpdateVehicle
);

/* ================================
   ADMIN VEHICLE MANAGEMENT
   ================================ */
router.get("/admin/vehicles/new", requireAdmin, showAddVehicleForm);
router.post("/admin/vehicles/new", requireAdmin, vehicleValidation, handleAddVehicle);
router.post("/admin/vehicles/:vehicleId/delete", requireAdmin, handleDeleteVehicle);

/* ================================
   ADMIN CATEGORY MANAGEMENT
   ================================ */
router.get("/admin/categories", requireAdmin, showCategoryManagementPage);
router.get("/admin/categories/new", requireAdmin, showAddCategoryForm);
router.post("/admin/categories/new", requireAdmin, categoryValidation, handleAddCategory);
router.get("/admin/categories/:categoryId/edit", requireAdmin, showEditCategoryForm);
router.post(
  "/admin/categories/:categoryId/edit",
  requireAdmin,
  categoryValidation,
  handleUpdateCategory
);
router.post("/admin/categories/:categoryId/delete", requireAdmin, handleDeleteCategory);

/* ================================
   CONTACT ROUTES
   ================================ */
router.get("/contact", showContactForm);
router.post("/contact", contactValidation, handleContactSubmission);

/* ================================
   AUTH ROUTES
   ================================ */
router.get("/register", showRegistrationForm);
router.post("/register", registrationValidation, processRegistration);

router.get("/login", showLoginForm);
router.post("/login", loginValidation, processLogin);
router.get("/logout", processLogout);

/* ================================
   DASHBOARD ROUTES
   ================================ */
router.get("/dashboard", requireLogin, (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  next();
}, showRoleDashboard);
router.get("/employee", requireEmployee, (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  next();
}, showEmployeeDashboard);
router.get("/admin", requireAdmin, (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  next();
}, showAdminDashboard);

/* ================================
   ADMIN CONTACT MESSAGE ROUTES
   ================================ */
router.get("/admin/contact-messages", requireEmployee, showContactMessages);
router.post(
  "/admin/contact-messages/:messageId/delete",
  requireEmployee,
  deleteContactMessageById
);

/* ================================
   USER VEHICLE ROUTES
   ================================ */
router.post("/my-vehicles/add", requireLogin, userVehicleValidation, handleAddUserVehicle);
router.get("/my-vehicles/:userVehicleId/edit", requireLogin, showEditUserVehicleForm);
router.post(
  "/my-vehicles/:userVehicleId/edit",
  requireLogin,
  userVehicleValidation,
  handleUpdateUserVehicle
);
router.post("/my-vehicles/:userVehicleId/delete", requireLogin, handleDeleteUserVehicle);

/* ================================
   SERVICE REQUEST ROUTES
   ================================ */
router.get("/service/request", requireLogin, showServiceRequestForm);
router.post(
  "/service/request",
  requireLogin,
  serviceRequestValidation,
  handleServiceRequestSubmission
);
router.get("/service/history", requireLogin, showUserServiceHistory);

/* ================================
   EMPLOYEE / ADMIN SERVICE REQUESTS
   ================================ */
router.get("/employee/service-requests", requireEmployee, showAllServiceRequests);
router.post(
  "/employee/service-requests/:requestId/status",
  requireEmployee,
  updateServiceRequestStatusById
);
router.post(
  "/employee/service-requests/:requestId/notes",
  requireEmployee,
  updateServiceRequestNotesById
);

/* ================================
   ADMIN EMPLOYEE ROUTES
   ================================ */
router.get("/admin/employees", requireAdmin, showEmployeeAccounts);
router.post("/admin/employees/:userId/role", requireAdmin, updateEmployeeRole);

/* ================================
   ADMIN SYSTEM ROUTE
   ================================ */
router.get("/admin/system", requireAdmin, showSystemOverview);

/* ================================
   TEST ROUTE
   ================================ */
router.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error"));
});

export default router;



