const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Cause = mongoose.model("Cause");

const router = express.Router();

router.get("/causes", async (req, res) => {
  const causes = await Cause.find().sort({ expires: 1 });
  res.send(causes);
});

router.post("/causes", requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(422).send({ error: "You must provide a name" });
  }

  try {
    const cause = new Cause(req.body);
    await cause.save();
    res.send(cause);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put("/causes/:id", requireAuth, async (req, res) => {
  const cause = await Cause.findOne({ _id: req.params.id });
  Object.assign(cause, req.body);
  await cause.save();
  res.send(cause);
});

module.exports = router;
