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
const {
  uploadWallpaperValidator,
  validate,
  wallpaperIdValidator,
} = require("../utils/validators");

const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

router.get("/popular", getPopularWallpapers);
router.post(
  "/",
  protect,
  upload.single("image"),
  uploadWallpaperValidator,
  validate,
  uploadWallpaper
);
router.get("/", getWallpapers);
router.get("/:id", wallpaperIdValidator, validate, getWallpaper);
router.post(
  "/:id/favorite",
  protect,
  wallpaperIdValidator,
  validate,
  addToFavorites
);
router.get("/:id/download", wallpaperIdValidator, validate, downloadWallpaper);

module.exports = router;
