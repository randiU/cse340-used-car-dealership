//Database layer for user account related data logic

import { db } from "./db.js";

const getUserByEmail = async (email) => {
  const sql = `
    SELECT
      u.user_id,
      u.role_id,
      u.first_name,
      u.last_name,
      u.email,
      u.password_hash,
      u.created_at,
      r.role_name
    FROM users u
    JOIN roles r
      ON u.role_id = r.role_id
    WHERE u.email = $1
    LIMIT 1;
  `;

  return db.query(sql, [email]);
};

const getUserById = async (userId) => {
  const sql = `
    SELECT
      u.user_id,
      u.role_id,
      u.first_name,
      u.last_name,
      u.email,
      u.created_at,
      r.role_name
    FROM users u
    JOIN roles r
      ON u.role_id = r.role_id
    WHERE u.user_id = $1
    LIMIT 1;
  `;

  return db.query(sql, [userId]);
};

const createUser = async ({ firstName, lastName, email, passwordHash, roleId = 1 }) => {
  const sql = `
    INSERT INTO users (
      role_id,
      first_name,
      last_name,
      email,
      password_hash
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, role_id, first_name, last_name, email, created_at;
  `;

  return db.query(sql, [roleId, firstName, lastName, email, passwordHash]);
};

const getAllUsersWithRoles = async () => {
  const sql = `
    SELECT
      u.user_id,
      u.role_id,
      u.first_name,
      u.last_name,
      u.email,
      u.created_at,
      r.role_name
    FROM users u
    JOIN roles r
      ON u.role_id = r.role_id
    ORDER BY
      r.role_name DESC,
      u.last_name,
      u.first_name,
      u.email;
  `;

  return db.query(sql);
};

const updateUserRoleById = async (userId, roleId) => {
  const sql = `
    UPDATE users
    SET role_id = $2
    WHERE user_id = $1
    RETURNING user_id, role_id, first_name, last_name, email, created_at;
  `;

  return db.query(sql, [userId, roleId]);
};

const getRoleByName = async (roleName) => {
  const sql = `
    SELECT role_id, role_name
    FROM roles
    WHERE LOWER(role_name) = LOWER($1)
    LIMIT 1;
  `;

  return db.query(sql, [roleName]);
};

export {
  getUserByEmail,
  getUserById,
  createUser,
  getAllUsersWithRoles,
  updateUserRoleById,
  getRoleByName
};

