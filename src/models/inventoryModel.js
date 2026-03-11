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

export { getAllVehicles, getVehicleBySlug, getVehiclesByCategorySlug, getAllCategories };
