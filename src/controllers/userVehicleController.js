import { validationResult } from "express-validator";
import {
  createUserVehicle,
  getUserVehicleById,
  updateUserVehicleById,
  deleteUserVehicleById
} from "../models/userVehicleModel.js";

//AI assisted with the add, edit and delete controller logic as this was more complicated because of having to check for ownership of the vehicle before allowing edits or deletion. I also had to troubleshoot some issues with the validation logic and error handling in these controllers.

const handleAddUserVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(error => req.flash("error", error.msg));
      return res.redirect("/dashboard");
    }

    const userId = req.session.user.userId;
    const { make, model, year, mileage } = req.body;

    await createUserVehicle({
      userId,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      mileage: Number(mileage)
    });

    req.flash("success", "Vehicle added successfully.");
    return res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

const showEditUserVehicleForm = async (req, res, next) => {
  try {
    const { userVehicleId } = req.params;
    const userId = req.session.user.userId;

    const vehicleData = await getUserVehicleById(userVehicleId);

    if (!vehicleData.rows.length) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/dashboard");
    }

    const vehicle = vehicleData.rows[0];

    if (vehicle.user_id !== userId) {
      req.flash("error", "You do not have permission to edit this vehicle.");
      return res.redirect("/dashboard");
    }

    return res.render("dashboard/edit-user-vehicle", {
      title: "Edit My Vehicle",
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateUserVehicle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach(error => req.flash("error", error.msg));
      return res.redirect(`/my-vehicles/${req.params.userVehicleId}/edit`);
    }

    const { userVehicleId } = req.params;
    const userId = req.session.user.userId;
    const { make, model, year, mileage } = req.body;

    const vehicleData = await getUserVehicleById(userVehicleId);

    if (!vehicleData.rows.length) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/dashboard");
    }

    const vehicle = vehicleData.rows[0];

    if (vehicle.user_id !== userId) {
      req.flash("error", "You do not have permission to edit this vehicle.");
      return res.redirect("/dashboard");
    }

    await updateUserVehicleById({
      userVehicleId,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      mileage: Number(mileage)
    });

    req.flash("success", "Vehicle updated successfully.");
    return res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

const handleDeleteUserVehicle = async (req, res, next) => {
  try {
    const { userVehicleId } = req.params;
    const userId = req.session.user.userId;

    const vehicleData = await getUserVehicleById(userVehicleId);

    if (!vehicleData.rows.length) {
      req.flash("error", "Vehicle not found.");
      return res.redirect("/dashboard");
    }

    const vehicle = vehicleData.rows[0];

    if (vehicle.user_id !== userId) {
      req.flash("error", "You do not have permission to delete this vehicle.");
      return res.redirect("/dashboard");
    }

    await deleteUserVehicleById(userVehicleId);

    req.flash("success", "Vehicle deleted successfully.");
    return res.redirect("/dashboard");
  } catch (error) {
    next(error);
  }
};

export {
  handleAddUserVehicle,
  showEditUserVehicleForm,
  handleUpdateUserVehicle,
  handleDeleteUserVehicle
};