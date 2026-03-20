import {
  getAllVehicles,
  getVehicleBySlug,
  getVehiclesByCategorySlug,
  getAllCategories,
  getReviewsByVehicleId,
  createReview,
  getReviewById,
  updateReview as updateReviewModel,
  deleteReview as deleteReviewModel
} from "../models/inventoryModel.js";

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

    res.render("vehicles/details", {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      vehicle,
      reviews: reviewData.rows
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

export {
  buildVehicleInventoryPage,
  buildVehicleDetailPage,
  buildCategoryVehiclePage,
  postReview,
  updateReview,
  deleteReview
};
