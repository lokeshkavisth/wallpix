const express = require("express");
const { register, login } = require("../controllers/authController");
const {
  registerValidator,
  validate,
  loginValidator,
} = require("../utils/validators");

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

module.exports = router;
