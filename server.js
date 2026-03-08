import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./src/controllers/routes.js";
import { setupDatabase, testConnection } from "./src/models/setup.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use("/", routes);

async function startServer() {
  try {
    await testConnection();   // tests PostgreSQL connection
    await setupDatabase();    // runs seed.sql if needed

    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000");
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();