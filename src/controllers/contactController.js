import { createContactMessage } from "../models/contactModel.js";
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

export { showContactForm, handleContactSubmission };