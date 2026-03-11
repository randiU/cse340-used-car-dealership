import { createContactMessage } from "../models/contactModel.js";

//Route handlers for contact pages
const showContactForm = async (req, res) => {
  res.render("contact/form", {
    title: "Contact Us"
  });
};

//Route handler for contact form submission
const handleContactSubmission = async (req, res) => {
  const { name, email, subject, message } = req.body;

  await createContactMessage({ name, email, subject, message });

  res.render("contact/success", {
    title: "Message Sent"
  });
};

export { showContactForm, handleContactSubmission };