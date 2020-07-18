const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Member = mongoose.model("Member");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in." });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.cryptoKey, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in." });
    }
    const { userId } = payload;
    const user = await Member.findById(userId);
    req.user = user;
    next();
  });
};
