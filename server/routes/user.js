const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

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

const authenticate = async (req, res, next) => {
  const userId = req.params.id;
  const { currentPassword } = req.body;
  const user = await User.find({ _id: userId });

  if (!user || !bcrypt.compareSync(currentPassword, user[0].password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // if (!user || currentPassword !== user[0].password) {
  //   return res.status(401).json({ error: "Invalid credentials" });
  // }
  req.user = user;
  next();
};
router.put("/change-password/:id", authenticate, async (req, res) => {
  const { newPassword } = req.body;
  const user = req.user;
  try {
    if (!newPassword) {
      throw new Error("New password is required");
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;
    const updatedUser = await User.findByIdAndUpdate(
      user[0]._id,
      { password: hashedPassword },
      {
        new: true,
      }
    );
    res
      .status(201)
      .json({ message: "Password changed successfully", updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
