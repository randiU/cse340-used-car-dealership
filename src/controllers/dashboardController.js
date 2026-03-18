import { getUserVehiclesByUserId } from "../models/userVehicleModel.js";

const showUserDashboard = async (req, res) => {
  const userId = req.session.user.userId;
  const vehicleData = await getUserVehiclesByUserId(userId);

  res.render("dashboard/dashboard", {
    title: "Dashboard",
    vehicles: vehicleData.rows
  });
};

const showEmployeeDashboard = (req, res) => {
  res.render("dashboard/employee", {
    title: "Employee Dashboard"
  });
};

const showAdminDashboard = (req, res) => {
  res.render("dashboard/admin", {
    title: "Admin Dashboard"
  });
};

export { showUserDashboard, showEmployeeDashboard, showAdminDashboard };