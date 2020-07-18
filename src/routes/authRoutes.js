const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const Member = mongoose.model("Member");

const router = express.Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "Must provide email and password" });
  }
  const user = await Member.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: "Invalid password or email" });
  }
  const passwordsAreEqual = await user.comparePassword(password);
  if (passwordsAreEqual) {
    const token = jwt.sign({ userId: user._id }, keys.cryptoKey);
    res.send({ token, userId: user._id, isAdmin: user.isAdmin });
  } else {
    return res.status(422).send({ error: "Invalid password or email" });
  }
});

module.exports = router;
