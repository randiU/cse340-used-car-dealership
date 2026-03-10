//Route handlers for static pages
  
const homePage = (req, res) => {
  res.render("home", { title: "Wasatch Auto Group" });
};

export { homePage };