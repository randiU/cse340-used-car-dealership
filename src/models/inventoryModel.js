import { db } from "./db.js";

//Returns all vehicles
async function getAllVehicles() {
  const sql = `
    SELECT 
      v.vehicle_id,
      v.make,
      v.model,
      v.year,
      v.price,
      v.mileage,
      v.slug,
      v.description,
      v.status,
      v.created_at,
      c.name AS category_name,
      c.slug AS category_slug
    FROM vehicles v
    JOIN categories c
      ON v.category_id = c.category_id
    ORDER BY v.year DESC, v.make, v.model;
  `;

  return db.query(sql);
}

//Returns vehicle details for a specific vehicle
async function getVehicleBySlug(slug) {
  const sql = `
    SELECT
      v.vehicle_id,
      v.make,
      v.model,
      v.year,
      v.price,
      v.mileage,
      v.slug,
      v.description,
      v.status,
      v.created_at,
      c.name AS category_name,
      c.slug AS category_slug
    FROM vehicles v
    JOIN categories c
      ON v.category_id = c.category_id
    WHERE v.slug = $1
    LIMIT 1;
  `;

  return db.query(sql, [slug]);
}

//Returns all vehicles for a specific category
async function getVehiclesByCategorySlug(categorySlug) {
  const sql = `
    SELECT
      v.vehicle_id,
      v.make,
      v.model,
      v.year,
      v.price,
      v.mileage,
      v.slug,
      v.description,
      v.status,
      v.created_at,
      c.name AS category_name,
      c.slug AS category_slug
    FROM vehicles v
    JOIN categories c
      ON v.category_id = c.category_id
    WHERE c.slug = $1
    ORDER BY v.year DESC, v.make, v.model;
  `;

  return db.query(sql, [categorySlug]);
}

//Returns all categories for navigation and filtering
async function getAllCategories() {
  const sql = `
    SELECT
      category_id,
      name,
      slug,
      description
    FROM categories
    ORDER BY name;
  `;

  return db.query(sql);
}

//Returns random featured vehicles for the home page
async function getFeaturedVehicles(limit = 3) {
  const sql = `
    SELECT 
      v.vehicle_id,
      v.make,
      v.model,
      v.year,
      v.price,
      v.mileage,
      v.slug,
      v.description,
      v.status,
      c.name AS category_name,
      c.slug AS category_slug
    FROM vehicles v
    JOIN categories c
      ON v.category_id = c.category_id
    WHERE v.status = 'available'
    ORDER BY RANDOM()
    LIMIT $1;
  `;

  return db.query(sql, [limit]);
}

// Reviews logic
async function getReviewsByVehicleId(vehicleId) {
  const sql = `
    SELECT
      r.review_id,
      r.vehicle_id,
      r.user_id,
      r.rating,
      r.review_text,
      r.created_at,
      u.first_name,
      u.last_name
    FROM reviews r
    JOIN users u
      ON r.user_id = u.user_id
    WHERE r.vehicle_id = $1
    ORDER BY r.created_at DESC;
  `;
  return db.query(sql, [vehicleId]);
}

async function createReview(vehicleId, userId, rating, reviewText) {
  const sql = `
    INSERT INTO reviews (
      vehicle_id,
      user_id,
      rating,
      review_text
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  return db.query(sql, [vehicleId, userId, rating, reviewText]);
}

async function getReviewById(reviewId) {
  const sql = `
    SELECT
      review_id,
      vehicle_id,
      user_id,
      rating,
      review_text,
      created_at
    FROM reviews
    WHERE review_id = $1
    LIMIT 1;
  `;
  return db.query(sql, [reviewId]);
}

async function updateReview(reviewId, rating, reviewText) {
  const sql = `
    UPDATE reviews
    SET
      rating = $2,
      review_text = $3
    WHERE review_id = $1
    RETURNING *;
  `;
  return db.query(sql, [reviewId, rating, reviewText]);
}

async function deleteReview(reviewId) {
  const sql = `
    DELETE FROM reviews
    WHERE review_id = $1
    RETURNING *;
  `;
  return db.query(sql, [reviewId]);
}

const getAllVehiclesForManagement = async () => {
  const sql = `
    SELECT
      v.vehicle_id,
      v.category_id,
      v.slug,
      v.make,
      v.model,
      v.year,
      v.price,
      v.mileage,
      v.description,
      v.status,
      v.created_at,
      c.name AS category_name,
      c.slug AS category_slug
    FROM vehicles v
    JOIN categories c
      ON v.category_id = c.category_id
    ORDER BY v.created_at DESC, v.year DESC, v.make, v.model;
  `;
  return db.query(sql);
};

const getVehicleById = async (vehicleId) => {
  const sql = `
    SELECT
      vehicle_id,
      category_id,
      slug,
      make,
      model,
      year,
      price,
      mileage,
      description,
      status,
      created_at
    FROM vehicles
    WHERE vehicle_id = $1
    LIMIT 1;
  `;
  return db.query(sql, [vehicleId]);
};

const createVehicle = async ({
  categoryId,
  slug,
  make,
  model,
  year,
  price,
  mileage,
  description,
  status
}) => {
  const sql = `
    INSERT INTO vehicles (
      category_id,
      slug,
      make,
      model,
      year,
      price,
      mileage,
      description,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
  return db.query(sql, [
    categoryId,
    slug,
    make,
    model,
    year,
    price,
    mileage,
    description,
    status
  ]);
};

const updateVehicleById = async ({
  vehicleId,
  categoryId,
  slug,
  make,
  model,
  year,
  price,
  mileage,
  description,
  status
}) => {
  const sql = `
    UPDATE vehicles
    SET
      category_id = $2,
      slug = $3,
      make = $4,
      model = $5,
      year = $6,
      price = $7,
      mileage = $8,
      description = $9,
      status = $10
    WHERE vehicle_id = $1
    RETURNING *;
  `;
  return db.query(sql, [
    vehicleId,
    categoryId,
    slug,
    make,
    model,
    year,
    price,
    mileage,
    description,
    status
  ]);
};

const deleteVehicleById = async (vehicleId) => {
  const sql = `
    DELETE FROM vehicles
    WHERE vehicle_id = $1
    RETURNING *;
  `;
  return db.query(sql, [vehicleId]);
};

const getCategoryById = async (categoryId) => {
  const sql = `
    SELECT
      category_id,
      name,
      slug,
      description
    FROM categories
    WHERE category_id = $1
    LIMIT 1;
  `;
  return db.query(sql, [categoryId]);
};

const createCategory = async ({ name, slug, description }) => {
  const sql = `
    INSERT INTO categories (
      name,
      slug,
      description
    )
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  return db.query(sql, [name, slug, description]);
};

const updateCategoryById = async ({ categoryId, name, slug, description }) => {
  const sql = `
    UPDATE categories
    SET
      name = $2,
      slug = $3,
      description = $4
    WHERE category_id = $1
    RETURNING *;
  `;
  return db.query(sql, [categoryId, name, slug, description]);
};

const deleteCategoryById = async (categoryId) => {
  const sql = `
    DELETE FROM categories
    WHERE category_id = $1
    RETURNING *;
  `;
  return db.query(sql, [categoryId]);
};


export { getAllVehicles, getVehicleBySlug, getVehiclesByCategorySlug, getAllCategories, getFeaturedVehicles, getReviewsByVehicleId, createReview, getReviewById, updateReview, deleteReview, getAllVehiclesForManagement, getVehicleById, createVehicle, updateVehicleById, deleteVehicleById, getCategoryById, createCategory, updateCategoryById, deleteCategoryById };
