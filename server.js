import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import MVC Components
import router from "./src/controllers/routes.js";
import { pageNotFoundHandler, globalErrorHandler } from "./src/controllers/errorHandler.js";
import { addLocalVariables } from "./src/middleware/global.js";



// Import database setup functions
import { setupDatabase, testConnection } from "./src/models/setup.js";

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

//set up express app
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Global Middleware
app.use(addLocalVariables);

// Routes
app.use("/", router);

//Error handling
app.use(pageNotFoundHandler);
app.use(globalErrorHandler);

async function startServer() {
  try {
    await setupDatabase();
    await testConnection();
    

    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

startServer();