import express from "express";
import { homePage } from "./index.js";
import { buildVehicleInventoryPage } from "./inventoryController.js";

const router = express.Router();


//Home page route
router.get("/", homePage);

//Inventory Routes
router.get("/vehicles", buildVehicleInventoryPage);

export default router;