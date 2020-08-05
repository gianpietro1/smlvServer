const express = require("express");
const mongoose = require("mongoose");
const pushNotifications = require("../middlewares/pushNotifications");
const requireAuth = require("../middlewares/requireAuth");

const PushToken = mongoose.model("PushToken");

const {
  createMessages,
  sendMessages,
  getReceiptIds,
  obtainReceipts,
} = pushNotifications;

const router = express.Router();

router.get("/notifications/tokens", requireAuth, async (req, res) => {
  const tokens = await PushToken.find();
  res.send(tokens);
});

router.get(
  "/notifications/tokens/member/:memberId",
  requireAuth,
  async (req, res) => {
    const tokens = await PushToken.find({ _member: req.params.memberId });
    res.send(tokens);
  }
);

router.get("/notifications/tokens/token/:token", async (req, res) => {
  const tokens = await PushToken.find({ pushToken: req.params.token });
  res.send(tokens);
});

router.delete("/notifications/tokens/:token", requireAuth, async (req, res) => {
  await PushToken.deleteOne({ pushToken: req.params.token }, function(err) {
    if (err) return res.status(422).send({ error: "Error deleting the entry" });
  });
  res.send(`${req.params.token} deleted.`);
});

router.post("/notifications/tokens", async (req, res) => {
  const { pushToken } = req.body;
  if (!pushToken) {
    return res.status(422).send({ error: "You must provide a push token" });
  }

  const oldPushToken = await PushToken.findOne({ pushToken });

  try {
    if (!oldPushToken) {
      const pushTokenBody = new PushToken(req.body);
      await pushTokenBody.save();
      res.send(pushTokenBody);
    } else {
      const pushTokenBody = Object.assign(oldPushToken, req.body);
      await pushTokenBody.save();
      res.send(pushTokenBody);
    }
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.post("/notifications/send", requireAuth, async (req, res) => {
  // send a notification to all clients
  let pushTokenObjects = await PushToken.find();
  let pushTokens = pushTokenObjects.map((item) => {
    return item.pushToken;
  });
  console.log(pushTokens);
  let messages = createMessages(
    req.body.title,
    req.body.messageBody,
    req.body.data,
    pushTokens
  );
  let tickets = await sendMessages(messages);
  let receiptIds = getReceiptIds(tickets);
  await obtainReceipts(receiptIds);
  res.send(receiptIds);
});

router.post("/notifications/send/:memberId", requireAuth, async (req, res) => {
  // send a notification to a specific client
  let memberId = req.params.memberId;
  let pushTokenObjects = await PushToken.find({ _member: memberId });
  let pushTokens = pushTokenObjects.map((item) => {
    return item.pushToken;
  });
  let messages = createMessages(
    req.body.messageBody,
    req.body.data,
    pushTokens
  );
  let tickets = await sendMessages(messages);
  let receiptIds = getReceiptIds(tickets);
  await obtainReceipts(receiptIds);
  res.send(receiptIds);
});

module.exports = router;
