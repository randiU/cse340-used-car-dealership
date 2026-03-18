import { db } from "./db.js";

const createServiceRequest = async ({ userId, userVehicleId, serviceType, description }) => {
  const sql = `
    INSERT INTO service_requests (
      user_id,
      user_vehicle_id,
      service_type,
      description
    )
    VALUES ($1, $2, $3, $4)
    RETURNING request_id, user_id, user_vehicle_id, service_type, description, status, created_at;
  `;

  return db.query(sql, [userId, userVehicleId, serviceType, description]);
};

const getServiceRequestsByUserId = async (userId) => {
  const sql = `
    SELECT
      sr.request_id,
      sr.service_type,
      sr.description,
      sr.status,
      sr.created_at,
      uv.user_vehicle_id,
      uv.make,
      uv.model,
      uv.year,
      uv.mileage
    FROM service_requests sr
    JOIN user_vehicles uv
      ON sr.user_vehicle_id = uv.user_vehicle_id
    WHERE sr.user_id = $1
    ORDER BY sr.created_at DESC;
  `;

  return db.query(sql, [userId]);
};

export { createServiceRequest, getServiceRequestsByUserId };
