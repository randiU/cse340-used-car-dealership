import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/controllers/routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use("/", routes);

app.listen(3000);

console.log('Server is running on http://localhost:3000');