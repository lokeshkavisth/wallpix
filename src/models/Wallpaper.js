const mongoose = require("mongoose");

const wallpaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [50, "Title cannot be more than 50 characters"],
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  imageUrl: {
    type: String,
    required: [true, "Please add an image URL"],
  },
  category: {
    type: String,
    required: [true, "Please specify a category"],
    enum: ["Nature", "Abstract", "Animals", "Space", "Other"],
  },
  uploadedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  favorites: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  downloadCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Wallpaper", wallpaperSchema);
