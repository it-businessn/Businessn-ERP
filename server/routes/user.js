const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const users = (await User.find()).sort({ date: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User does not exist" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/register", async (req, res) => {
  const {
    companyId,
    firstName,
    middleName,
    lastName,
    fullName,
    email,
    password,
    role,
    department,
    manager,
    phoneNumber,
    address,
  } = req.body;

  const user = new User({
    companyId,
    firstName,
    middleName,
    lastName,
    fullName,
    email,
    password,
    role,
    department,
    manager,
    phoneNumber,
    address,
    date: Date.now(),
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
