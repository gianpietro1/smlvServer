const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");

const AWS = require("aws-sdk");
const { v1: uuid } = require("uuid");
const keys = require("../config/keys");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

router.get("/upload", requireAuth, (req, res) => {
  const mini = req.query.mini;
  const type = req.query.type;

  let baseDir = "adminUser";
  let fileName = `${uuid()}.jpeg`;

  if (type) {
    if (type === "avatar") {
      baseDir = "avatars";
    } else if (type === "project") {
      baseDir = "projects";
    }
  }

  if (mini && mini === "true") {
    baseDir = baseDir + "-mini";
  }

  let key = `${baseDir}/${fileName}`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "smlv01",
      Key: key,
      ContentType: "image/jpeg",
    },
    (err, url) => {
      res.send({ key, url });
    }
  );
});

// TO DELETE IN APP v0.1.5+
router.get("/uploadMini", requireAuth, (req, res) => {
  const key = `adminUserMinis/${uuid()}.jpeg`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "smlv01",
      Key: key,
      ContentType: "image/jpeg",
    },
    (err, url) => {
      res.send({ key, url });
    }
  );
});

router.delete("/upload", requireAuth, (req, res) => {
  const key = req.query.key;

  s3.deleteObject(
    {
      Bucket: "smlv01",
      Key: key,
    },
    (err, data) => {
      res.send(data);
    }
  );
});

module.exports = router;
