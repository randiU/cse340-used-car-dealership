import { db } from "./db.js";

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

export { getAllVehicles };