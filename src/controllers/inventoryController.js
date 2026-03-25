import {
  getAllVehicles,
  getVehicleBySlug,
  getVehiclesByCategorySlug,
  getAllCategories,
  getReviewsByVehicleId,
  createReview,
  getReviewById,
  updateReview as updateReviewModel,
  deleteReview as deleteReviewModel,
  getAllVehiclesForManagement,
  getVehicleById,
  createVehicle,
  updateVehicleById,
  deleteVehicleById,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getImagesByVehicleId
} from "../models/inventoryModel.js";

const buildSlug = (make, model, year) => {
  return `${make}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Route handlers for inventory pages
const buildVehicleInventoryPage = async (req, res, next) => {
  try {
    const vehicleData = await getAllVehicles();
    const categoryData = await getAllCategories();

    res.render("vehicles/browse", {
      title: "Browse Vehicles",
      vehicles: vehicleData.rows,
      categories: categoryData.rows
    });
  } catch (error) {
    next(error);
  }
};

// Route handler for vehicle details page
const buildVehicleDetailPage = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const vehicleData = await getVehicleBySlug(slug);

    if (!vehicleData.rows.length) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    const vehicle = vehicleData.rows[0];
    const reviewData = await getReviewsByVehicleId(vehicle.vehicle_id);
    const imageData = await getImagesByVehicleId(vehicle.vehicle_id);

    res.render("vehicles/details", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle,
      reviews: reviewData.rows,
      images: imageData.rows
    });
  } catch (error) {
    next(error);
  }
};


// Route handler for category filtered inventory page
const buildCategoryVehiclePage = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

const postReview = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { rating, review_text } = req.body;
    const user = req.session.user;

    const vehicleData = await getVehicleBySlug(slug);

    if (!vehicleData.rows.length) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    const vehicle = vehicleData.rows[0];

    if (!rating || !review_text || !review_text.trim()) {
      req.flash("error", "Rating and review text are required.");
      return res.redirect(`/vehicles/${slug}`);
    }

    await createReview(
      vehicle.vehicle_id,
      user.userId,
      Number(rating),
      review_text.trim()
    );

    req.flash("success", "Review submitted successfully.");
    return res.redirect(`/vehicles/${slug}`);
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const { slug, reviewId } = req.params;
    const { rating, review_text } = req.body;
    const user = req.session.user;

    const reviewData = await getReviewById(reviewId);

    if (!reviewData.rows.length) {
      const err = new Error("Review not found");
      err.status = 404;
      return next(err);
    }

    const review = reviewData.rows[0];
    const isOwner = user.userId === review.user_id;
    const isStaff = user.roleName === "employee" || user.roleName === "admin";

    if (!isOwner && !isStaff) {
      req.flash("error", "You do not have permission to edit this review.");
      return res.redirect(`/vehicles/${slug}`);
    }

    if (!rating || !review_text || !review_text.trim()) {
      req.flash("error", "Rating and review text are required.");
      return res.redirect(`/vehicles/${slug}`);
    }

    await updateReviewModel(reviewId, Number(rating), review_text.trim());

    req.flash("success", "Review updated successfully.");
    return res.redirect(`/vehicles/${slug}`);
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { slug, reviewId } = req.params;
    const user = req.session.user;

    const reviewData = await getReviewById(reviewId);

    if (!reviewData.rows.length) {
      const err = new Error("Review not found");
      err.status = 404;
      return next(err);
    }

    const review = reviewData.rows[0];
    const isOwner = user.userId === review.user_id;
    const isStaff = user.roleName === "employee" || user.roleName === "admin";

    if (!isOwner && !isStaff) {
      req.flash("error", "You do not have permission to delete this review.");
      return res.redirect(`/vehicles/${slug}`);
    }

    await deleteReviewModel(reviewId);

    req.flash("success", "Review deleted successfully.");
    return res.redirect(`/vehicles/${slug}`);
  } catch (error) {
    next(error);
  }
};

// Additional route handlers for inventory management (for employee/admin)

const showVehicleManagementPage = async (req, res, next) => {
  try {
    const vehicleData = await getAllVehiclesForManagement();

    res.render("dashboard/employee/vehicles", {
      title: "Manage Inventory",
      vehicles: vehicleData.rows
    });
  } catch (error) {
    next(error);
  }
};

const showAddVehicleForm = async (req, res, next) => {
  try {
    const categoryData = await getAllCategories();

    res.render("dashboard/admin/add-vehicle", {
      title: "Add Vehicle",
      categories: categoryData.rows
    });
  } catch (error) {
    next(error);
  }
};

const handleAddVehicle = async (req, res, next) => {
  try {
    const {
      category_id,
      make,
      model,
      year,
      price,
      mileage,
      description,
      status
    } = req.body;

    const slug = buildSlug(make, model, year);

    await createVehicle({
      categoryId: Number(category_id),
      slug,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      description: description?.trim() || "",
      status: status?.trim() || "available"
    });

    req.flash("success", "Vehicle added successfully.");
    return res.redirect("/employee/vehicles");
  } catch (error) {
    next(error);
  }
};

const showEditVehicleForm = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const vehicleData = await getVehicleById(vehicleId);
    const categoryData = await getAllCategories();

    if (!vehicleData.rows.length) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    res.render("dashboard/employee/edit-vehicle", {
      title: "Edit Vehicle",
      vehicle: vehicleData.rows[0],
      categories: categoryData.rows
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateVehicle = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;
    const {
      category_id,
      make,
      model,
      year,
      price,
      mileage,
      description,
      status
    } = req.body;

    const slug = buildSlug(make, model, year);

    const existingVehicle = await getVehicleById(vehicleId);
    if (!existingVehicle.rows.length) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    await updateVehicleById({
      vehicleId: Number(vehicleId),
      categoryId: Number(category_id),
      slug,
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      description: description?.trim() || "",
      status: status?.trim() || "available"
    });

    req.flash("success", "Vehicle updated successfully.");
    return res.redirect("/employee/vehicles");
  } catch (error) {
    next(error);
  }
};

const handleDeleteVehicle = async (req, res, next) => {
  try {
    const { vehicleId } = req.params;

    const vehicleData = await getVehicleById(vehicleId);
    if (!vehicleData.rows.length) {
      const err = new Error("Vehicle not found");
      err.status = 404;
      return next(err);
    }

    await deleteVehicleById(vehicleId);

    req.flash("success", "Vehicle deleted successfully.");
    return res.redirect("/employee/vehicles");
  } catch (error) {
    next(error);
  }
};

const showCategoryManagementPage = async (req, res, next) => {
  try {
    const categoryData = await getAllCategories();

    res.render("dashboard/admin/categories", {
      title: "Manage Categories",
      categories: categoryData.rows
    });
  } catch (error) {
    next(error);
  }
};

const showAddCategoryForm = (req, res) => {
  res.render("dashboard/admin/add-category", {
    title: "Add Category"
  });
};

const handleAddCategory = async (req, res, next) => {
  try {
    const { name, slug, description } = req.body;

    await createCategory({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || ""
    });

    req.flash("success", "Category added successfully.");
    return res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
};

const showEditCategoryForm = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const categoryData = await getCategoryById(categoryId);

    if (!categoryData.rows.length) {
      const err = new Error("Category not found");
      err.status = 404;
      return next(err);
    }

    res.render("dashboard/admin/edit-category", {
      title: "Edit Category",
      category: categoryData.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, slug, description } = req.body;

    await updateCategoryById({
      categoryId: Number(categoryId),
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || ""
    });

    req.flash("success", "Category updated successfully.");
    return res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
};

const handleDeleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    await deleteCategoryById(categoryId);

    req.flash("success", "Category deleted successfully.");
    return res.redirect("/admin/categories");
  } catch (error) {
    next(error);
  }
};


export {
  buildVehicleInventoryPage,
  buildVehicleDetailPage,
  buildCategoryVehiclePage,
  postReview,
  updateReview,
  deleteReview,
  showVehicleManagementPage,
  showAddVehicleForm,
  handleAddVehicle,
  showEditVehicleForm,
  handleUpdateVehicle,
  handleDeleteVehicle,
  showCategoryManagementPage,
  showAddCategoryForm,
  handleAddCategory,
  showEditCategoryForm,
  handleUpdateCategory,
  handleDeleteCategory
};
