import { db } from "./db.js";

//Creates a new contact message in the database
const createContactMessage = async ({ name, email, subject, message }) => {
  const sql = `
    INSERT INTO contact_messages (
      name,
      email,
      subject,
      message
    )
    VALUES ($1, $2, $3, $4)
    RETURNING message_id, name, email, subject, message, created_at;
  `;

  return db.query(sql, [name, email, subject, message]);
};

export { createContactMessage };