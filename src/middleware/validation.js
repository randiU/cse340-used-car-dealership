import { body } from "express-validator";


const contactValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Name can only contain letters, spaces, hyphens, and apostrophes"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email address is too long"),

  body("subject")
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Subject must be between 2 and 255 characters")
    .matches(/^[a-zA-Z0-9\s\-.,!?]+$/)
    .withMessage("Subject contains invalid characters"),

  body("message")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters")
    .custom((value) => {
      const words = value.split(/\s+/);
      const uniqueWords = new Set(words);

      if (words.length > 20 && uniqueWords.size / words.length < 0.3) {
        throw new Error("Message appears to be spam");
      }

      return true;
    })
];

export { contactValidation };