const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const User = require("../models/userModel");

/// @desc   Register new admin
// @route   POST /api/admin
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);

    throw new Error("please add all feilds");
  }
  //if exist
  const adminExist = await Admin.findOne({ email });
  if (adminExist) {
    res.status(400);

    throw new Error("Admin already exist");
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  //check if created
  if (admin) {
    res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/// @desc   Authenticate admin
// @route   POST /api/admins/login
// @access  Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check for user email
  const admin = await Admin.findOne({ email });

  //Check for admin's password
  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

/// @desc   Get user data
// @route   GET /api/users/me
// @access  Private
const getUser = asyncHandler(async (req, res) => {
  //all the users from database
  const users = await User.find();

  //check if admin is true or not by jwt token
  const admin = await Admin.findById(req.admin.id);

  //check for user
  if (!admin) {
    res.status(401);
    throw new Error("admin not found");
  }

  //Check for admin's password
  if (admin) {
    res.json(users);
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  registerAdmin,
  loginAdmin,
  getUser,
};
