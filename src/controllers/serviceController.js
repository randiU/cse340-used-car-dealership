import { validationResult } from "express-validator";
import { getUserVehiclesByUserId } from "../models/userVehicleModel.js";
import {
  createServiceRequest,
  getServiceRequestsByUserId
} from "../models/serviceRequestModel.js";

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

export {
  showServiceRequestForm,
  handleServiceRequestSubmission,
  showUserServiceHistory
};