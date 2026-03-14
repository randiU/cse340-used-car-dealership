//Route handlers for static pages
import { getFeaturedVehicles, getAllCategories } from "../models/inventoryModel.js";
  
const homePage = async (req, res, next) => {
  try {
    const [featuredVehicles, categories] = await Promise.all([
      getFeaturedVehicles(3),
      getAllCategories()
    ]);
    res.render("home", { 
      title: "Wasatch Auto Group",
      featuredVehicles: featuredVehicles.rows,
      categories: categories.rows
    });
  } catch (error) {
    next(error);
  }
};

export { homePage };