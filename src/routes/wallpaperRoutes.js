const express = require("express");

const multer = require("multer");
const {
  uploadWallpaper,
  getWallpapers,
  getWallpaper,
  addToFavorites,
  getPopularWallpapers,
  downloadWallpaper,
} = require("../controllers/wallpaperController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

router.get("/popular", getPopularWallpapers);
router.post("/", protect, upload.single("image"), uploadWallpaper);
router.get("/", getWallpapers);
router.get("/:id", getWallpaper);
router.post("/:id/favorite", protect, addToFavorites);
router.get("/:id/download", downloadWallpaper);

module.exports = router;
