const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config({ path: "./config.env" });

const connectDB = require("./src/configs/db");
const authRoutes = require("./src/routes/authRoutes");
const wallpaperRoutes = require("./src/routes/wallpaperRoutes");
const errorHandler = require("./src/middlewares/errorHandler");
const swaggerSpecs = require("./src/configs/swagger");

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(helmet());

// Add morgan logging in development only
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallpapers", wallpaperRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error handling middleware should be added after routes
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
