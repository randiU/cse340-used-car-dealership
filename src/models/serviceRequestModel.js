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

const getAllServiceRequests = async () => {
  const sql = `
    SELECT
      sr.request_id,
      sr.user_id,
      sr.user_vehicle_id,
      sr.service_type,
      sr.description,
      sr.status,
      sr.notes,
      sr.created_at,
      u.first_name,
      u.last_name,
      u.email,
      uv.make,
      uv.model,
      uv.year,
      uv.mileage
    FROM service_requests sr
    JOIN users u
      ON sr.user_id = u.user_id
    JOIN user_vehicles uv
      ON sr.user_vehicle_id = uv.user_vehicle_id
    ORDER BY sr.created_at DESC;
  `;

  return db.query(sql);
};

const updateServiceRequestStatus = async (requestId, status) => {
  const sql = `
    UPDATE service_requests
    SET status = $2
    WHERE request_id = $1
    RETURNING request_id, status;
  `;

  return db.query(sql, [requestId, status]);
};

const updateServiceRequestNotes = async (requestId, notes) => {
  const sql = `
    UPDATE service_requests
    SET notes = $2
    WHERE request_id = $1
    RETURNING request_id, notes;
  `;

  return db.query(sql, [requestId, notes]);
};

const getServiceRequestWithNotes = async (requestId) => {
  const sql = `
    SELECT
      sr.request_id,
      sr.service_type,
      sr.description,
      sr.status,
      sr.notes,
      sr.created_at,
      uv.user_vehicle_id,
      uv.make,
      uv.model,
      uv.year,
      uv.mileage
    FROM service_requests sr
    JOIN user_vehicles uv
      ON sr.user_vehicle_id = uv.user_vehicle_id
    WHERE sr.request_id = $1;
  `;

  return db.query(sql, [requestId]);
};

export {
  createServiceRequest,
  getServiceRequestsByUserId,
  getAllServiceRequests,
  updateServiceRequestStatus,
  updateServiceRequestNotes,
  getServiceRequestWithNotes
};
