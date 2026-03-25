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
  serviceRequestValidation
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
import { showSystemOverview } from "./systemController.js";

const router = express.Router();

router.use("/vehicles", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/browse.css">');
  next();
});

router.use("/contact", (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/contact.css">');
  next();
});

router.get("/", homePage);

router.get("/vehicles", buildVehicleInventoryPage);
router.get("/vehicles/category/:slug", buildCategoryVehiclePage);
router.get("/vehicles/:slug", buildVehicleDetailPage);

router.post("/vehicles/:slug/reviews", requireLogin, postReview);
router.post("/vehicles/:slug/reviews/:reviewId/update", requireLogin, updateReview);
router.post("/vehicles/:slug/reviews/:reviewId/delete", requireLogin, deleteReview);

router.get("/employee/vehicles", requireEmployee, showVehicleManagementPage);
router.get("/employee/vehicles/:vehicleId/edit", requireEmployee, showEditVehicleForm);
router.post("/employee/vehicles/:vehicleId/edit", requireEmployee, handleUpdateVehicle);

router.get("/admin/vehicles/new", requireAdmin, showAddVehicleForm);
router.post("/admin/vehicles/new", requireAdmin, handleAddVehicle);
router.post("/admin/vehicles/:vehicleId/delete", requireAdmin, handleDeleteVehicle);

router.get("/admin/categories", requireAdmin, showCategoryManagementPage);
router.get("/admin/categories/new", requireAdmin, showAddCategoryForm);
router.post("/admin/categories/new", requireAdmin, handleAddCategory);
router.get("/admin/categories/:categoryId/edit", requireAdmin, showEditCategoryForm);
router.post("/admin/categories/:categoryId/edit", requireAdmin, handleUpdateCategory);
router.post("/admin/categories/:categoryId/delete", requireAdmin, handleDeleteCategory);

router.get("/contact", showContactForm);
router.post("/contact", contactValidation, handleContactSubmission);

router.get("/register", showRegistrationForm);
router.post("/register", registrationValidation, processRegistration);

router.get("/login", showLoginForm);
router.post("/login", loginValidation, processLogin);
router.get("/logout", processLogout);

router.get("/dashboard", requireLogin, showRoleDashboard);
router.get("/employee", requireEmployee, showEmployeeDashboard);
router.get("/admin", requireAdmin, showAdminDashboard);

router.get("/admin/contact-messages", requireEmployee, showContactMessages);
router.post("/admin/contact-messages/:messageId/delete", requireEmployee, deleteContactMessageById);

router.post("/my-vehicles/add", requireLogin, handleAddUserVehicle);
router.get("/my-vehicles/:userVehicleId/edit", requireLogin, showEditUserVehicleForm);
router.post("/my-vehicles/:userVehicleId/edit", requireLogin, handleUpdateUserVehicle);
router.post("/my-vehicles/:userVehicleId/delete", requireLogin, handleDeleteUserVehicle);

router.get("/service/request", requireLogin, showServiceRequestForm);
router.post("/service/request", requireLogin, serviceRequestValidation, handleServiceRequestSubmission);
router.get("/service/history", requireLogin, showUserServiceHistory);

router.get("/employee/service-requests", requireEmployee, showAllServiceRequests);
router.post("/employee/service-requests/:requestId/status", requireEmployee, updateServiceRequestStatusById);
router.post("/employee/service-requests/:requestId/notes", requireEmployee, updateServiceRequestNotesById);

router.get("/admin/employees", requireAdmin, showEmployeeAccounts);
router.post("/admin/employees/:userId/role", requireAdmin, updateEmployeeRole);

router.get("/admin/system", requireAdmin, showSystemOverview);

router.get("/test-error", (req, res, next) => {
  next(new Error("This is a test error"));
});

export default router;

