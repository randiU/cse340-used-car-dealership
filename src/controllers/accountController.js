import bcrypt from "bcrypt";
import { getUserByEmail, createUser } from "../models/accountModel.js";

const showRegistrationForm = (req, res) => {
  res.render("account/register", {
    title: "Register"
  });
};

//Process registration form submission
const processRegistration = async (req, res) => {
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

const showLoginForm = (req, res) => {
  res.render("account/login", {
    title: "Login"
  });
};

const processLogin = async (req, res) => {
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
  res.redirect("/dashboard");
};

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
