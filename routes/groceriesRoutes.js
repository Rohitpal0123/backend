const express = require("express");
const router = express.Router();

const {
  getGroceries,
  setGroceries,
  updateGroceries,
  deleteGroceries,
} = require("../controllers/groceriesController");

const { protectUser } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protectUser, getGroceries)
  .post(protectUser, setGroceries);

router
  .route("/:id")
  .put(protectUser, updateGroceries)
  .delete(protectUser, deleteGroceries);

module.exports = router;
