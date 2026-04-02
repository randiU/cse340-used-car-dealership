

import { db } from "./db.js";

const getAllVehicles = async () => {
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
      c.slug AS category_slug,
      vi.image_path,
      vi.alt_text
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    LEFT JOIN vehicle_images vi
      ON v.vehicle_id = vi.vehicle_id
     AND vi.is_primary = true
    ORDER BY v.created_at DESC, v.year DESC, v.make, v.model;
  `;

  return db.query(sql);
};

async function getVehicleBySlug(slug) {
  const sql = `
    SELECT
      v.vehicle_id,
      v.category_id,
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
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    WHERE v.slug = $1
    LIMIT 1;
  `;

  return db.query(sql, [slug]);
}

const getVehiclesByCategorySlug = async (slug) => {
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
      c.slug AS category_slug,
      vi.image_path,
      vi.alt_text
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    LEFT JOIN vehicle_images vi
      ON v.vehicle_id = vi.vehicle_id
     AND vi.is_primary = true
    WHERE c.slug = $1
    ORDER BY v.created_at DESC, v.year DESC, v.make, v.model;
  `;

  return db.query(sql, [slug]);
};

const getAllCategories = async () => {
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
};

const getFeaturedVehicles = async (limit = 3) => {
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
      c.name AS category_name,
      c.slug AS category_slug,
      vi.image_path,
      vi.alt_text
    FROM vehicles v
    LEFT JOIN categories c
      ON v.category_id = c.category_id
    LEFT JOIN vehicle_images vi
      ON v.vehicle_id = vi.vehicle_id
     AND vi.is_primary = true
    WHERE v.status = 'available'
    ORDER BY RANDOM()
    LIMIT $1;
  `;

  return db.query(sql, [limit]);
};

const getReviewsByVehicleId = async (vehicleId) => {
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
};

async function getReviewsByUserId(userId) {
  const sql = `
    SELECT
      r.review_id,
      r.vehicle_id,
      r.user_id,
      r.rating,
      r.review_text,
      r.created_at,
      v.slug,
      v.make,
      v.model,
      v.year
    FROM reviews r
    JOIN vehicles v
      ON r.vehicle_id = v.vehicle_id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC;
  `;
  return db.query(sql, [userId]);
}

const getReviewById = async (reviewId) => {
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
};

const createReview = async (vehicleId, userId, rating, reviewText) => {
  const sql = `
    INSERT INTO reviews (
      vehicle_id,
      user_id,
      rating,
      review_text
    )
    VALUES ($1, $2, $3, $4)
    RETURNING
      review_id,
      vehicle_id,
      user_id,
      rating,
      review_text,
      created_at;
  `;

  return db.query(sql, [vehicleId, userId, rating, reviewText]);
};

const updateReview = async (reviewId, rating, reviewText) => {
  const sql = `
    UPDATE reviews
    SET
      rating = $2,
      review_text = $3
    WHERE review_id = $1
    RETURNING
      review_id,
      vehicle_id,
      user_id,
      rating,
      review_text,
      created_at;
  `;

  return db.query(sql, [reviewId, rating, reviewText]);
};

const deleteReview = async (reviewId) => {
  const sql = `
    DELETE FROM reviews
    WHERE review_id = $1
    RETURNING
      review_id,
      vehicle_id,
      user_id,
      rating,
      review_text,
      created_at;
  `;

  return db.query(sql, [reviewId]);
};

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
    LEFT JOIN categories c
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

const getCategoryBySlug = async (slug) => {
  const sql = `
    SELECT
      category_id,
      name,
      slug,
      description
    FROM categories
    WHERE slug = $1
    LIMIT 1;
  `;

  return db.query(sql, [slug]);
};

const getImagesByVehicleId = async (vehicleId) => {
  const sql = `
    SELECT
      image_id,
      vehicle_id,
      image_path,
      alt_text,
      is_primary,
      sort_order
    FROM vehicle_images
    WHERE vehicle_id = $1
    ORDER BY is_primary DESC, sort_order ASC, image_id ASC;
  `;

  return db.query(sql, [vehicleId]);
};

export {
  getAllVehicles,
  getVehicleBySlug,
  getVehiclesByCategorySlug,
  getAllCategories,
  getFeaturedVehicles,
  getReviewsByVehicleId,
  getReviewsByUserId,
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  getAllVehiclesForManagement,
  getVehicleById,
  createVehicle,
  updateVehicleById,
  deleteVehicleById,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoryBySlug,
  getImagesByVehicleId
};


