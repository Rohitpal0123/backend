const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getUser,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/authAdminMiddleware");

router.post("/", registerAdmin);
router.post("/login", loginAdmin);
router.get("/users", protectAdmin, getUser);
module.exports = router;
