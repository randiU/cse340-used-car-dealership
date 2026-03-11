import { getAllVehicles, getVehicleBySlug, getVehiclesByCategorySlug, getAllCategories } from "../models/inventoryModel.js";

//Route handlers for inventory pages
const buildVehicleInventoryPage = async (req, res) => {
  const vehicleData = await getAllVehicles();
  const categoryData = await getAllCategories();

  res.render("vehicles/browse", {
    title: "Browse Vehicles",
    vehicles: vehicleData.rows,
    categories: categoryData.rows
  });
};

//Route handler for vehicle details page
const buildVehicleDetailPage = async (req, res, next) => {
  const { slug } = req.params;
  const vehicleData = await getVehicleBySlug(slug);

  if (!vehicleData.rows.length) {
    const err = new Error("Vehicle not found");
    err.status = 404;
    return next(err);
  }

  const vehicle = vehicleData.rows[0];

  res.render("vehicles/details", {
    title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    vehicle
  });
};

//Route handler for category filtered inventory page
const buildCategoryVehiclePage = async (req, res, next) => {
  const { slug } = req.params;
  const vehicleData = await getVehiclesByCategorySlug(slug);
  const categoryData = await getAllCategories();

  if (!vehicleData.rows.length) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  const categoryName = vehicleData.rows[0].category_name;

  res.render("vehicles/browse", {
    title: `${categoryName} Vehicles`,
    vehicles: vehicleData.rows,
    categories: categoryData.rows
  });
};



export { buildVehicleInventoryPage, buildVehicleDetailPage, buildCategoryVehiclePage };