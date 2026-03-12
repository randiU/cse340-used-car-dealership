import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Import MVC Components
import router from "./src/controllers/routes.js";
import { pageNotFoundHandler, globalErrorHandler } from "./src/controllers/errorHandler.js";
import { addLocalVariables } from "./src/middleware/global.js";



// Import database setup functions
import { setupDatabase, testConnection } from "./src/models/setup.js";

// Import session and flash middleware
import session from "express-session";
import flash from "./src/middleware/flash.js";
import connectPgSimple from "connect-pg-simple";
import { caCert } from "./src/models/db.js";

// Start session cleanup process
import { startSessionCleanup } from "./src/utils/session-cleanup.js";

/**
 * Server configuration
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;

//set up express app
const app = express();

// Required for secure cookies when deployed on Render behind a proxy
app.set("trust proxy", 1);

// Initialize PostgreSQL session store
const pgSession = connectPgSimple(session);

// Configure session middleware
app.use(session({
    store: new pgSession({
        conObject: {
            connectionString: process.env.DB_URL,
            // Configure SSL for session store connection (required by BYU-I databases)
            ssl: {
                ca: caCert,
                rejectUnauthorized: true,
                checkServerIdentity: () => { return undefined; }
            }
        },
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: NODE_ENV.includes('dev') !== true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Start automatic session cleanup
startSessionCleanup();

//Checks is session cleanup is running in global.js and logs message to console
console.log('Session cleanup scheduling is enabled (connect-pg-simple will handle expired sessions).');

/**
 * Configure Express
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Global Middleware
app.use(addLocalVariables);

//Flash message middleware
app.use(flash);

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