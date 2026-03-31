import { getUserVehiclesByUserId } from "../models/userVehicleModel.js";
import { getReviewsByUserId } from "../models/inventoryModel.js";

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

const showUserDashboard = async (req, res, next) => {
  try {
    const userId = req.session.user.userId;
    const vehicleData = await getUserVehiclesByUserId(userId);
    const reviewData = await getReviewsByUserId(userId);

    res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
    res.render("dashboard/dashboard", {
      title: "Dashboard",
      vehicles: vehicleData.rows,
      reviews: reviewData.rows
    });
  } catch (error) {
    next(error);
  }
};

const showEmployeeDashboard = (req, res) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  res.render("dashboard/employee", {
    title: "Employee Dashboard"
  });
};

const showAdminDashboard = (req, res) => {
  res.addStyle('<link rel="stylesheet" href="/css/dashboard.css">');
  res.render("dashboard/admin", {
    title: "Admin Dashboard"
  });
};

const showRoleDashboard = async (req, res, next) => {
  const dashboardPath = getDashboardPathByRole(req.session.user.roleName);

  if (dashboardPath === "/dashboard") {
    return showUserDashboard(req, res, next);
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
