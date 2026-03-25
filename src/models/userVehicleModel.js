import { db } from "./db.js";

const getUserVehiclesByUserId = async (userId) => {
  const sql = `
    SELECT
      user_vehicle_id,
      user_id,
      make,
      model,
      year,
      mileage,
      created_at
    FROM user_vehicles
    WHERE user_id = $1
    ORDER BY year DESC, make, model;
  `;

  return db.query(sql, [userId]);
};

const getAllUserVehicles = async () => {
  const sql = `
    SELECT
      uv.user_vehicle_id,
      uv.user_id,
      uv.make,
      uv.model,
      uv.year,
      uv.mileage,
      uv.created_at,
      u.first_name,
      u.last_name,
      u.email
    FROM user_vehicles uv
    JOIN users u
      ON uv.user_id = u.user_id
    ORDER BY uv.created_at DESC, uv.year DESC, uv.make, uv.model;
  `;

  return db.query(sql);
};

const createUserVehicle = async ({ userId, make, model, year, mileage }) => {
  const sql = `
    INSERT INTO user_vehicles (
      user_id,
      make,
      model,
      year,
      mileage
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_vehicle_id, user_id, make, model, year, mileage, created_at;
  `;

  return db.query(sql, [userId, make, model, year, mileage]);
};

export { getUserVehiclesByUserId, getAllUserVehicles, createUserVehicle };
