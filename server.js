const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./src/routes/authRoutes");
const wallpaperRoutes = require("./src/routes/wallpaperRoutes");
const connectDB = require("./src/config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/wallpapers", wallpaperRoutes);

app.get("/", (req, res) => {
  res.send("Wallpaper App API");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
