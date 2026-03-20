import { getUserVehiclesByUserId } from "../models/userVehicleModel.js";

const getDashboardPathByRole = (roleName) => {
  const normalizedRole = roleName?.toLowerCase();

  if (normalizedRole === "admin") {
    return "/admin";
  }

  if (normalizedRole === "employee") {
    return "/employee";
  }

  return "/dashboard";
};

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

const showRoleDashboard = async (req, res) => {
  const dashboardPath = getDashboardPathByRole(req.session.user.roleName);

  if (dashboardPath === "/dashboard") {
    return showUserDashboard(req, res);
  }

  return res.redirect(dashboardPath);
};

export {
  getDashboardPathByRole,
  showUserDashboard,
  showEmployeeDashboard,
  showAdminDashboard,
  showRoleDashboard
};