import { getAllVehicles } from "./src/models/inventoryModel.js";

try {
  const data = await getAllVehicles();
  console.log(data.rows);
} catch (error) {
  console.error("Inventory model test failed:", error);
}