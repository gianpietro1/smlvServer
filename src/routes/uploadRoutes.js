const express = require("express");
const router = express.Router();

const AWS = require("aws-sdk");
const { v1: uuid } = require("uuid");
const keys = require("../config/keys");

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

router.get("/upload", (req, res) => {
  const key = `adminUser/${uuid()}.jpeg`;

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

router.get("/uploadMini", (req, res) => {
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

module.exports = router;
