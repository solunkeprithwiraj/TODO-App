const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendVerificationEmail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

// @desc    Register a new user
// @route   POST /signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate and hash verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = await bcrypt.hash(verificationToken, 10);

    // Create new user
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verificationToken: hashedVerificationToken,
      verificationTokenExpires: Date.now() + 3600000, // 1 hour
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message:
        "User created successfully. Please check your email for verification.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Verify user email
// @route   GET /verify-email?token=...
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const users = await User.find();
    let user = null;

    for (const u of users) {
      const isMatch = await bcrypt.compare(token, u.verificationToken || "");
      if (isMatch) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(400).send("Invalid or expired token.");
    }

    if (user.verificationTokenExpires < Date.now()) {
      return res
        .status(400)
        .send("Verification token expired. Please sign up again.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.send("Email verified successfully. You can now log in.");
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send("Server error.");
  }
};

// @desc    Authenticate user
// @route   POST /login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email: email.toLowerCase() });
    if (!userExist) {
      return res.status(400).json({ error: "User does not exist" });
    }

    if (!userExist.isVerified) {
      return res.status(403).json({ error: "Please verify your email first" });
    }

  

    const token = generateToken(userExist.id);

    res.json({
      message: "User authenticated successfully",
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        isAdmin: userExist.isAdmin,
        token,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerUser, loginUser, verifyEmail };
