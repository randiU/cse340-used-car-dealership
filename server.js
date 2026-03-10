import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import MVC Components
import router from "./src/controllers/routes.js";

// Import database setup functions
import { setupDatabase, testConnection } from "./src/models/setup.js";

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use("/", router);

async function startServer() {
  try {
    await testConnection();
    await setupDatabase();

    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();