const asynchandler = require("express-async-handler");
const Grocery = require("../models/groceryModel");
const User = require("../models/userModel");
// @desc   Set goal
// @route  SET /api/groceries
// @access Private
//get grocery
const getGroceries = asynchandler(async (req, res) => {
  const groceries = await Grocery.find({ user: req.user.id });

  const count = groceries.length;
  res.status(200).json({
    "grocery count": `${count}`,
    grocery: groceries,
  });
});

// @desc   Put goal
// @route  PUT /api/groceries/
// @access Private
const setGroceries = asynchandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a text");
  }

  const grocery = await Grocery.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.status(200).json(grocery);
});
// @desc   Update goal
// @route  UPDATE /api/groceries/:id
// @access Private
const updateGroceries = asynchandler(async (req, res) => {
  const grocery = await Grocery.findById(req.params.id);

  if (!grocery) {
    res.status(400);

    throw new Error("Grocery not found");
  }

  //fetching user in database by jwt token user id
  const user = await User.findById(req.user.id);
  //check for user
  if (!user) {
    res.status(401);
    throw new Error("user not found");
  }

  //checking if right user updating the data
  if (grocery.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const updatedGrocery = await Grocery.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedGrocery);
});

/// @desc   Delete goal
// @route   DELETE /api/groceries/:id
// @access  Private
const deleteGroceries = asynchandler(async (req, res) => {
  const grocery = await Grocery.findById(req.params.id);

  if (!grocery) {
    res.status(400);

    throw new Error("Grocery not found");
  }
  //fetching user in database by jwt token user id
  const user = await User.findById(req.user.id);
  //check for user
  if (!user) {
    res.status(401);
    throw new Error("user not found");
  }

  //checking if right user updating the data
  if (grocery.user.toString() !== user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const deletedGrocery = await grocery.remove();
  res.status(200).json(deletedGrocery);
});

module.exports = {
  getGroceries,
  setGroceries,
  updateGroceries,
  deleteGroceries,
};
