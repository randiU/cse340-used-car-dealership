const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    req.flash("error", "You must be logged in to view that page.");
    return res.redirect("/login");
  }

  next();
};

export { requireLogin };
