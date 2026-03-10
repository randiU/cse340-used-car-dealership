import { getAllVehicles } from "../models/inventoryModel.js";

async function buildVehicleInventoryPage(req, res, next) {
  try {
    const data = await getAllVehicles();

    res.render("vehicles/browse", {
      title: "Browse Vehicles",
      vehicles: data.rows
    });
  } catch (error) {
    next(error);
  }
}

export { buildVehicleInventoryPage };