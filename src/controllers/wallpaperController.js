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
      return next(new Error("Please upload an image"));
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
    next(error);
  }
};

// @desc    Get all wallpapers with filtering and search
// @route   GET /api/wallpapers
// @access  Public
exports.getWallpapers = async (req, res) => {
  try {
    let query = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search by title
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    // Filter by upload date
    if (req.query.fromDate) {
      query.createdAt = { $gte: new Date(req.query.fromDate) };
    }

    // Sort options
    let sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    } else {
      // Default sort by createdAt in descending order
      sort = { createdAt: -1 };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Wallpaper.countDocuments(query);
    const wallpapers = await Wallpaper.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .populate("uploadedBy", "username");

    res.json({
      success: true,
      count: wallpapers.length,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
      },
      data: wallpapers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular wallpapers
// @route   GET /api/wallpapers/popular
// @access  Public
exports.getPopularWallpapers = async (req, res) => {
  try {
    const wallpapers = await Wallpaper.find()
      .sort({ downloadCount: -1, favorites: -1 })
      .limit(10)
      .populate("uploadedBy", "username");

    res.json({
      success: true,
      count: wallpapers.length,
      data: wallpapers,
    });
  } catch (error) {
    next(error);
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
    next(error);
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
    next(error);
  }
};

// @desc    Download wallpaper and increment download count
// @route   GET /api/wallpapers/:id/download
// @access  Public
exports.downloadWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);
    if (!wallpaper) {
      return res.status(404).json({ message: "Wallpaper not found" });
    }

    // Increment download count
    wallpaper.downloadCount += 1;
    await wallpaper.save();

    // In a real-world scenario, you might want to stream the file instead of redirecting
    res.redirect(wallpaper.imageUrl);
  } catch (error) {
    next(error);
  }
};
