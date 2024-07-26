const Wallpaper = require("../models/Wallpaper");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Upload a wallpaper
// @route   POST /api/wallpapers
// @access  Private
exports.uploadWallpaper = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    const wallpaper = await Wallpaper.create({
      title,
      description,
      category,
      imageUrl: result.secure_url,
      uploadedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: wallpaper,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all wallpapers
// @route   GET /api/wallpapers
// @access  Public
exports.getWallpapers = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find().populate(
      "uploadedBy",
      "username"
    );
    res.json({
      success: true,
      count: wallpapers.length,
      data: wallpapers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single wallpaper
// @route   GET /api/wallpapers/:id
// @access  Public
exports.getWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id).populate(
      "uploadedBy",
      "username"
    );
    if (!wallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }
    res.json({
      success: true,
      data: wallpaper,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add wallpaper to favorites
// @route   POST /api/wallpapers/:id/favorite
// @access  Private
exports.addToFavorites = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }

    if (wallpaper.favorites.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "Wallpaper already in favorites" });
    }

    wallpaper.favorites.push(req.user.id);
    await wallpaper.save();

    res.json({
      success: true,
      message: "Added to favorites",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
