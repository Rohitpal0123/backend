const express = require("express");
const router = express.Router();
const user_route = express();
const {
  registerUser,
  loginUser,
  getMe,
  registerPage,
} = require("../controllers/userController");

const { protectUser } = require("../middleware/authMiddleware");
user_route.set("views", "./views/users");
user_route.set("view engine", "ejs");

router.get("/", registerPage);
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protectUser, getMe);
module.exports = router;
