// Middleware to add global variables and functions to res.locals
const setHeadAssetsFunctionality = (res) => {
  res.locals.styles = [];
  res.locals.scripts = [];

  res.addStyle = (css, priority = 0) => {
    res.locals.styles.push({ content: css, priority });
  };

  res.addScript = (js, priority = 0) => {
    res.locals.scripts.push({ content: js, priority });
  };

  res.locals.renderStyles = () => {
    return res.locals.styles
      .sort((a, b) => b.priority - a.priority)
      .map(item => item.content)
      .join("\n");
  };

  res.locals.renderScripts = () => {
    return res.locals.scripts
      .sort((a, b) => b.priority - a.priority)
      .map(item => item.content)
      .join("\n");
  };
};

const addLocalVariables = (req, res, next) => {
  setHeadAssetsFunctionality(res);

  res.locals.currentYear = new Date().getFullYear();
  res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
  //checks if user is logged in by checking for session user object, then sets isLoggedIn to true or false accordingly
  res.locals.isLoggedIn = !!(req.session && req.session.user);

  next();
};

export { addLocalVariables };