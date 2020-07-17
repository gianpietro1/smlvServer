const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");

const Project = mongoose.model("Project");
const Member = mongoose.model("Member");

const router = express.Router();

router.get("/projects", async (req, res) => {
  const projects = await Project.find()
    .sort({ expires: 1 })
    .lean();
  const promises = projects.map(async (project) => {
    return {
      ...project,
      memberData: await Member.findOne({
        _id: project._member,
      }),
    };
  });
  const newProjects = await Promise.all(promises);
  res.send(newProjects);
});

router.post("/projects", requireAuth, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(422).send({ error: "You must provide a name" });
  }

  try {
    const project = new Project(req.body);
    await project.save();
    res.send(project);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
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
