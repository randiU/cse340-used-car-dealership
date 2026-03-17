const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to view that page.");
    return res.redirect("/login");
  }

  next();
};

const requireEmployee = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to view that page.");
    return res.redirect("/login");
  }

  const { roleName } = req.session.user;

  if (roleName !== "employee" && roleName !== "admin") {
    req.flash("error", "You do not have permission to view that page.");
    return res.redirect("/dashboard");
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to view that page.");
    return res.redirect("/login");
  }

  const { roleName } = req.session.user;

  if (roleName !== "admin") {
    req.flash("error", "You do not have permission to view that page.");
    // Redirect to appropriate dashboard based on role
    if (roleName === "employee") {
      return res.redirect("/employee");
    }
    return res.redirect("/dashboard");
  }

  next();
};

export { requireLogin, requireEmployee, requireAdmin };
