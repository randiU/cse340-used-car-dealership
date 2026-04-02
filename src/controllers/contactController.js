import {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage
} from "../models/contactModel.js";

import { validationResult } from "express-validator";

//Route handlers for contact pages
const showContactForm = async (req, res) => {
  res.render("contact/form", {
    title: "Contact Us"
  });
};

//Route handler for contact form submission
const handleContactSubmission = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);

    errorMessages.forEach(message => req.flash("error", message));
    return res.redirect("/contact");
  }

  const { name, email, subject, message } = req.body;

  await createContactMessage({ name, email, subject, message });

  req.flash("success", "Your message has been sent successfully.");
  res.redirect("/contact");
};

//Admin route handler to show all contact messages
const showContactMessages = async (req, res) => {
  const data = await getAllContactMessages();

  res.render("dashboard/admin/contact-messages", {
    title: "Contact Messages",
    messages: data.rows
  });
};

//Admin route handler to delete a contact message
const deleteContactMessageById = async (req, res) => {
  const { messageId } = req.params;

  const result = await deleteContactMessage(messageId);

  if (!result.rows.length) {
    req.flash("error", "Contact message not found.");
    return res.redirect("/admin/contact-messages");
  }

  req.flash("success", "Contact message deleted successfully.");
  res.redirect("/admin/contact-messages");
};


export { showContactForm, handleContactSubmission, showContactMessages, deleteContactMessageById };