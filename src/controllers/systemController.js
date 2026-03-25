import { getAllUsersWithRoles } from "../models/accountModel.js";
import { getAllContactMessages } from "../models/contactModel.js";
import { getAllServiceRequests } from "../models/serviceRequestModel.js";
import { getAllUserVehicles } from "../models/userVehicleModel.js";

const showSystemOverview = async (req, res, next) => {
  try {
    const [usersResult, contactResult, serviceResult, userVehiclesResult] = await Promise.all([
      getAllUsersWithRoles(),
      getAllContactMessages(),
      getAllServiceRequests(),
      getAllUserVehicles()
    ]);

    res.render("dashboard/admin/system", {
      title: "System Activity and User Data",
      users: usersResult.rows,
      contactMessages: contactResult.rows,
      serviceRequests: serviceResult.rows,
      userVehicles: userVehiclesResult.rows,
      totals: {
        users: usersResult.rows.length,
        contactMessages: contactResult.rows.length,
        serviceRequests: serviceResult.rows.length,
        userVehicles: userVehiclesResult.rows.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export { showSystemOverview };
