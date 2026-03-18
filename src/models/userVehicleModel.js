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

export { getUserVehiclesByUserId, createUserVehicle };