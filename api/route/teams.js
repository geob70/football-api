const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Team = require("../models/teams");

router.get("/", (req, res, next) => {
  Team.find()
    .exec()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/add", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      return res.json({
        status: 403,
        message: "Forbidden",
      });
    }
    const team = new Team({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      location: req.body.location,
    });
    team
      .save()
      .then(() => {
        res.status(201).json({
          status: 201,
          message: "Created team",
        });
      })
      .catch((err) => {
        res.json({
          status: 500,
          error: err,
        });
      });
  });
});

router.patch("/:teamId", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      return res.json({
        status: 403,
        message: "Forbidden",
      });
    }
    const id = req.params.teamId;
    Team.updateOne(
      { _id: id },
      { $set: { name: req.body.name, location: req.body.location } }
    )
      .exec()
      .then(() => {
        res.status(200).json({
          status: 200,
          message: "Updated sucessfully",
        });
      })
      .catch((err) => {
        // res.status(500).json({
        //   error: err,
        // });
        res.json({
          status: 500,
          error: err,
        });
      });
  });
});

router.delete("/:teamId", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      return res.json({
        status: 403,
        message: "Forbidden",
      });
    }
    const id = req.params.teamId;
    Team.deleteOne({ _id: id })
      .exec()
      .then(() => {
        res.status(204).json({ status: 204, message: "Team deleted" });
      })
      .catch((err) => {
        res.json({
          status: 500,
          error: err,
        });
      });
  });
});

function verifyToken(req, res, next) {
  //Get auth header value
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    return res.sendStatus(403);
  }
}

module.exports = router;
