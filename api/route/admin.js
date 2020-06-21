const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const redis = require("redis");
// const redisPort = process.env.PORT || 6379;

// const client = redis.createClient(redisPort);

const Admin = require("../models/admin");

router.post("/sign-up", async (req, res, next) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin({
      _id: mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
    });
    admin
      .save()
      .then(() => {
        res.status(201).json({ message: "Admin created" });
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  }
});

router.post("/login", async (req, res, next) => {
  Admin.findOne({ email: req.body.email })
    .exec()
    .then((admin) => {
      bcrypt.compare(req.body.password, admin.password).then((response) => {
        if (response !== true) {
          return res.status(404).json({
            message: "password doesn't match",
          });
        }
        jwt.sign(
          { admin },
          "secretKey",
          { expiresIn: "1800s" },
          (err, token) => {
            if (err) return res.status(401).json({ message: "Unauthorized" });
            // client.setex("token", 1800, token);
            return res.status(200).json({
              token,
            });
          }
        );
      });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

router.delete("/logout", async (req, res, next) => {
  client.del("token");
  return res.status(204);
});

// router.get("/get-token", cache, async (req, res, next) => {
//   jwt.verify(req.token, "secretKey", (err, data) => {
//     if (err) {
//       return res.status(403).json({
//         message: err,
//       });
//     }
//     res.status(200).json({
//       admin: {
//         username: data.admin.username,
//         email: data.admin.email,
//       },
//       token: req.token,
//     });
//   });
// });

router.post("/verify-token", async (req, res, next) => {
  console.log(req.body);
  jwt.verify(req.body.token, "secretKey", (err, data) => {
    if (err) {
      return res.status(403).json({
        message: err,
      });
    }
    res.status(200).json({
      admin: {
        username: data.admin.username,
        email: data.admin.email,
      },
      token: req.body.token,
    });
  });
});

// function cache(req, res, next) {
//   client.get("token", (err, data) => {
//     if (err) res.sendStatus(400).json({ error: err });
//     if (data !== null) {
//       req.token = data;
//       next();
//     } else return res.sendStatus(400);
//   });
// }

module.exports = router;
