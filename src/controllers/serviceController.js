import { validationResult } from "express-validator";
import { getUserVehiclesByUserId } from "../models/userVehicleModel.js";
import {
  createServiceRequest,
  getServiceRequestsByUserId,
  getAllServiceRequests,
  updateServiceRequestStatus
} from "../models/serviceRequestModel.js";
import { updateServiceRequestNotes } from "../models/serviceRequestModel.js";

// Show the service request form
const showServiceRequestForm = async (req, res) => {
  const userId = req.session.user.userId;
  const vehicleData = await getUserVehiclesByUserId(userId);

  res.render("service/request-form", {
    title: "Submit Service Request",
    vehicles: vehicleData.rows
  });
};

// Handle service request form submission
const handleServiceRequestSubmission = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash("error", error.msg));
    return res.redirect("/service/request");
  }

  const userId = req.session.user.userId;
  const { user_vehicle_id, service_type, description } = req.body;

  await createServiceRequest({
    userId,
    userVehicleId: user_vehicle_id,
    serviceType: service_type,
    description
  });

  req.flash("success", "Service request submitted successfully.");
  res.redirect("/service/history");
};

// Show logged-in user's service request history
const showUserServiceHistory = async (req, res) => {
  const userId = req.session.user.userId;
  const data = await getServiceRequestsByUserId(userId);
  const vehicleData = await getUserVehiclesByUserId(userId);

  res.render("service/history", {
    title: "My Service Requests",
    requests: data.rows,
    vehicles: vehicleData.rows
  });
};

// Show all service requests for employee/admin
const showAllServiceRequests = async (req, res) => {
  const data = await getAllServiceRequests();

  res.render("dashboard/admin/service-requests", {
    title: "Manage Service Requests",
    requests: data.rows
  });
};

// Update service request status
const updateServiceRequestStatusById = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  const allowedStatuses = ["submitted", "in_progress", "completed"];

  if (!allowedStatuses.includes(status)) {
    req.flash("error", "Invalid service request status.");
    return res.redirect("/employee/service-requests");
  }

  const result = await updateServiceRequestStatus(requestId, status);

  if (!result.rows.length) {
    req.flash("error", "Service request not found.");
    return res.redirect("/employee/service-requests");
  }

  req.flash("success", "Service request status updated.");
  res.redirect("/employee/service-requests");
};

// Update service request notes
const updateServiceRequestNotesById = async (req, res) => {
  const { requestId } = req.params;
  const { notes } = req.body;

  if (!notes || notes.trim() === "") {
    req.flash("error", "Notes cannot be empty.");
    return res.redirect("/employee/service-requests");
  }

  const result = await updateServiceRequestNotes(requestId, notes);

  if (!result.rows.length) {
    req.flash("error", "Service request not found.");
    return res.redirect("/employee/service-requests");
  }

  req.flash("success", "Notes updated successfully.");
  res.redirect("/employee/service-requests");
};

export {
  showServiceRequestForm,
  handleServiceRequestSubmission,
  showUserServiceHistory,
  showAllServiceRequests,
  updateServiceRequestStatusById,
  updateServiceRequestNotesById
};