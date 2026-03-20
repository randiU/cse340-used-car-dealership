import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { getUserByEmail, createUser } from "../models/accountModel.js";

// Show registration form
const showRegistrationForm = (req, res) => {
  res.render("account/register", {
    title: "Register"
  });
};

// Process registration form submission
const processRegistration = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach(error => req.flash("error", error.msg));
    return res.redirect("/register");
  }

  const { first_name, last_name, email, password } = req.body;

  const existingUser = await getUserByEmail(email);
  if (existingUser.rows.length > 0) {
    req.flash("error", "An account with that email already exists.");
    return res.redirect("/register");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await createUser({
    firstName: first_name,
    lastName: last_name,
    email,
    passwordHash
  });

  req.flash("success", "Account created successfully. Please log in.");
  res.redirect("/login");
};

// Show login form
const showLoginForm = (req, res) => {
  res.render("account/login", {
    title: "Login"
  });
};

// Process login form submission
const processLogin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    errorMessages.forEach(message => req.flash("error", message));
    return res.redirect("/login");
  }

  const { email, password } = req.body;

  const result = await getUserByEmail(email);

  if (!result.rows.length) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }

  const user = result.rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }

  req.session.user = {
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    roleId: user.role_id,
    roleName: user.role_name
  };

  req.flash("success", "You are now logged in.");
  const roleName = user.role_name.toLowerCase();
  if (roleName === "admin") {
    res.redirect("/admin");
  } else if (roleName === "employee") {
    res.redirect("/employee");
  } else {
    res.redirect("/dashboard");
  }
};

// Process logout
const processLogout = (req, res) => {
  req.session.regenerate((error) => {
    if (error) {
      req.flash("error", "There was a problem logging out.");
      return res.redirect("/dashboard");
    }

    req.flash("success", "You have been logged out successfully.");
    res.redirect("/");
  });
};

export {
  showRegistrationForm,
  processRegistration,
  showLoginForm,
  processLogin,
  processLogout
};
