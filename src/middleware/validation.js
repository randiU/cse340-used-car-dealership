//Ai assisted with Regex patterns and debugging validation logic. 

import { body } from "express-validator";

//AI assisted in debugging error with subject field where the input was being rejected with regular characters.
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
    .bail()
    .matches(/^[\p{L}\p{N}\s&'()\-.,!?]+$/u)
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

const registrationValidation = [
  body("first_name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("First name can only contain letters, spaces, hyphens, and apostrophes"),

  body("last_name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Last name can only contain letters, spaces, hyphens, and apostrophes"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email address is too long"),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage("Password must contain at least one special character")
];

const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email address is too long"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
];

const serviceRequestValidation = [
  body("user_vehicle_id")
    .notEmpty()
    .withMessage("Please select a vehicle")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Please select a valid vehicle"),

  body("service_type")
    .notEmpty()
    .withMessage("Please select a service type")
    .bail()
    .isIn([
      "Oil Change",
      "Brake Inspection"
    ])
    .withMessage("Please select a valid service type"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters")
];

const vehicleValidation = [
  body("category_id")
    .notEmpty()
    .withMessage("Please select a category")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Please select a valid category"),

  body("make")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Make must be between 2 and 50 characters"),

  body("model")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Model must be between 1 and 50 characters"),

  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .bail()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Please enter a valid year"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be a valid positive number"),

  body("mileage")
    .notEmpty()
    .withMessage("Mileage is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Mileage must be a valid non-negative number"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("status")
    .notEmpty()
    .withMessage("Please select a status")
    .bail()
    .isIn(["available", "pending", "sold"])
    .withMessage("Please select a valid status")
];

const categoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),

  body("slug")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Slug must be between 2 and 50 characters")
    .matches(/^[a-z0-9-]+$/)
    .withMessage("Slug must use lowercase letters, numbers, and hyphens only"),

  body("description")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
];

const userVehicleValidation = [
  body("make")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Make must be between 2 and 50 characters"),

  body("model")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Model must be between 1 and 50 characters"),

  body("year")
    .notEmpty()
    .withMessage("Year is required")
    .bail()
    .isInt({ min: 1900, max: 2100 })
    .withMessage("Please enter a valid year"),

  body("mileage")
    .notEmpty()
    .withMessage("Mileage is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Mileage must be a valid non-negative number")
];

export {
  contactValidation,
  registrationValidation,
  loginValidation,
  serviceRequestValidation,
  vehicleValidation,
  categoryValidation,
  userVehicleValidation
};



