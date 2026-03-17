import db from "./db.js";

const createServiceRequest = async ({ userId, vehicleId, serviceType, description }) => {
  const sql = `
    INSERT INTO service_requests (
      user_id,
      vehicle_id,
      service_type,
      description
    )
    VALUES ($1, $2, $3, $4)
    RETURNING request_id, user_id, vehicle_id, service_type, description, status, created_at;
  `;

  return db.query(sql, [userId, vehicleId, serviceType, description]);
};

const getServiceRequestsByUserId = async (userId) => {
  const sql = `
    SELECT
      sr.request_id,
      sr.service_type,
      sr.description,
      sr.status,
      sr.created_at,
      v.make,
      v.model,
      v.year,
      v.slug
    FROM service_requests sr
    JOIN vehicles v
      ON sr.vehicle_id = v.vehicle_id
    WHERE sr.user_id = $1
    ORDER BY sr.created_at DESC;
  `;

  return db.query(sql, [userId]);
};

export { createServiceRequest, getServiceRequestsByUserId };
