import {
  createUserVehicle,
  getUserVehicleById,
  updateUserVehicleById,
  deleteUserVehicleById
} from "../models/userVehicleModel.js";

const handleAddUserVehicle = async (req, res, next) => {
  try {
    const userId = req.session.user.userId;
    const { make, model, year, mileage } = req.body;

    await createUserVehicle({
      userId,
      make,
      model,
      year,
      mileage
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
      make,
      model,
      year,
      mileage
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