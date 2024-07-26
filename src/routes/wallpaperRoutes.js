const express = require("express");
const multer = require("multer");

const { protect } = require("../middlewares/authMiddleware");
const {
  uploadWallpaper,
  getWallpapers,
  getWallpaper,
  addToFavorites,
  getPopularWallpapers,
  downloadWallpaper,
} = require("../controllers/wallpaperController");
const {
  uploadWallpaperValidator,
  wallpaperIdValidator,
  validate,
} = require("../utils/validators");

const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /api/wallpapers:
 *   post:
 *     summary: Upload a new wallpaper
 *     description: Upload a new wallpaper. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Nature, Abstract, Animals, Space, Other]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Wallpaper uploaded successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */

router.post(
  "/",
  protect,
  upload.single("image"),
  uploadWallpaperValidator,
  validate,
  uploadWallpaper
);

/**
 * @swagger
 * /api/wallpapers/{id}/favorite:
 *   post:
 *     summary: Add wallpaper to favorites
 *     description: Add a wallpaper to the user's favorites. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallpaper ID
 *     responses:
 *       200:
 *         description: Wallpaper added to favorites
 *       400:
 *         description: Wallpaper already in favorites
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Wallpaper not found
 *       500:
 *         description: Server error
 */

router.post(
  "/:id/favorite",
  protect,
  wallpaperIdValidator,
  validate,
  addToFavorites
);

/**
 * @swagger
 * /api/wallpapers:
 *   get:
 *     summary: Get all wallpapers
 *     description: Retrieve a list of all wallpapers. Can be filtered and sorted.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of wallpapers to retrieve
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for wallpaper titles
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., 'createdAt:desc')
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of wallpapers
 *       500:
 *         description: Server error
 */

router.get("/", getWallpapers);

/**
 * @swagger
 * /api/wallpapers/popular:
 *   get:
 *     summary: Get popular wallpapers
 *     description: Retrieve a list of the most popular wallpapers based on download count and favorites.
 *     responses:
 *       200:
 *         description: A list of popular wallpapers
 *       500:
 *         description: Server error
 */
router.get("/popular", getPopularWallpapers);

/**
 * @swagger
 * /api/wallpapers/{id}:
 *   get:
 *     summary: Get a single wallpaper
 *     description: Retrieve details of a specific wallpaper by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallpaper ID
 *     responses:
 *       200:
 *         description: Wallpaper details
 *       404:
 *         description: Wallpaper not found
 *       500:
 *         description: Server error
 */

router.get("/:id", wallpaperIdValidator, validate, getWallpaper);

/**
 * @swagger
 * /api/wallpapers/{id}/download:
 *   get:
 *     summary: Download a wallpaper
 *     description: Download a wallpaper and increment its download count.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Wallpaper ID
 *     responses:
 *       200:
 *         description: Redirects to the wallpaper image URL
 *       404:
 *         description: Wallpaper not found
 *       500:
 *         description: Server error
 */

router.get("/:id/download", wallpaperIdValidator, validate, downloadWallpaper);

module.exports = router;
