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

const getAllContactMessages = async () => {
  const sql = `
    SELECT
      message_id,
      name,
      email,
      subject,
      message,
      created_at
    FROM contact_messages
    ORDER BY created_at DESC;
  `;

  return db.query(sql);
};

const deleteContactMessage = async (messageId) => {
  const sql = `
    DELETE FROM contact_messages
    WHERE message_id = $1
    RETURNING message_id;
  `;

  return db.query(sql, [messageId]);
};


export { createContactMessage, getAllContactMessages, deleteContactMessage };