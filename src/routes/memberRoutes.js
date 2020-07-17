const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Member = mongoose.model("Member");

const router = express.Router();

//router.use(requireAuth);

router.get("/members", async (req, res) => {
  const members = await Member.find().sort({ lastname: 1 });
  res.send(members);
});

router.get("/members/:id", async (req, res) => {
  const member = await Member.find({ _id: req.params.id });
  res.send(member);
});

router.put("/members/:id", requireAuth, async (req, res) => {
  const { email, password } = req.body;
  let member = await Member.findOne({ email });
  const passwordsAreEqual = await member.comparePassword(password);
  if (passwordsAreEqual) {
    // password is NOT changing
    delete req.body.password;
  }
  Object.assign(member, req.body);
  await member.save();
  res.send(member);
});

module.exports = router;
