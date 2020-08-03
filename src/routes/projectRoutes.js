const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");
const pushNotifications = require("../middlewares/pushNotifications");

const Project = mongoose.model("Project");
const PushToken = mongoose.model("PushToken");

const {
  createMessages,
  sendMessages,
  getReceiptIds,
  obtainReceipts,
} = pushNotifications;

const router = express.Router();

router.get("/projects", async (req, res) => {
  const projects = await Project.find().sort({ name: 1 });
  res.send(projects);
});

router.post("/projects", requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(422).send({ error: "You must provide a name" });
  }

  // try {
  // save project
  const project = new Project(req.body);
  await project.save();
  res.send(project);

  // send a new project notification to all clients
  const projectPopulated = await Project.findOne({
    _id: project._id,
  }).populate("_member");
  const projectMember = projectPopulated._member;
  let pushTokenObjects = await PushToken.find();
  if (pushTokenObjects) {
    let pushTokens = pushTokenObjects.map((item) => {
      return item.pushToken;
    });
    let body = `${projectMember.name} ${projectMember.lastname} publicó el proyecto ${name}`;
    let data = { projectName: project.name };
    console.log(data);
    let title = "Nuevo Proyecto en la LV";
    let messages = createMessages(title, body, data, pushTokens);
    let tickets = await sendMessages(messages);
    let receiptIds = getReceiptIds(tickets);
    await obtainReceipts(receiptIds);
  }
  // } catch (err) {
  //   res.status(422).send({ error: err.message });
  // }
});

router.put("/projects/:id", requireAuth, async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id });
  Object.assign(project, req.body);
  await project.save();
  res.send(project);
});

router.delete("/projects/:id", requireAuth, async (req, res) => {
  await Project.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return res.status(422).send({ error: "Error deleting the entry" });
    // deleted at most one tank document
  });
  res.send(`${req.params.id} deleted.`);
});

module.exports = router;
