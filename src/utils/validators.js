const { body, param, validationResult } = require("express-validator");

exports.registerValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password").exists().withMessage("Password is required"),
];

exports.uploadWallpaperValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("category")
    .isIn(["Nature", "Abstract", "Animals", "Space", "Anime", "Other"])
    .withMessage("Invalid category"),
];

exports.wallpaperIdValidator = [
  param("id").isMongoId().withMessage("Invalid wallpaper ID"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
