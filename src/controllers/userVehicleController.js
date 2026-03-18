import { createUserVehicle } from "../models/userVehicleModel.js";


const handleAddUserVehicle = async (req, res) => {
  const userId = req.session.user.userId;
  const { make, model, year, mileage } = req.body;

  await createUserVehicle({
    userId,
    make,
    model,
    year,
    mileage
  });

  req.flash("success", "Vehicle added successfully.");
  res.redirect("/dashboard");
};

export { handleAddUserVehicle };