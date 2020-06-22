const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Fixture = require("../models/fixtures");
const Team = require("../models/teams");

router.get("/", (req, res, next) => {
  Fixture.find()
    .populate("teamA teamB", "name")
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
    Team.findById(req.body.teamA).then((teamA) => {
      Team.findById(req.body.teamB)
        .then((teamB) => {
          if (!teamB || !teamA) {
            return res.json({
              status: 404,
              message: "Team not found",
            });
          }
          let _location = teamA.location;
          const fixture = new Fixture({
            _id: mongoose.Types.ObjectId(),
            teamA: req.body.teamA,
            teamB: req.body.teamB,
            time: req.body.time,
            date: req.body.date,
            location: _location,
          });
          fixture.save().then(() => {
            res.status(201).json({ status: 201, message: "fixture created" });
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
});

router.patch("/:fixtureId", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      return res.json({
        status: 403,
        message: "Forbidden",
      });
    }
    const id = req.params.fixtureId;
    Team.findById(req.body.teamA).then((teamA) => {
      Team.findById(req.body.teamB)
        .then((teamB) => {
          if (!teamB || !teamA) {
            return res.json({
              status: 404,
              message: "Team not found",
            });
          }
          let _location = teamA.location;
          Fixture.updateOne(
            { _id: id },
            {
              $set: {
                teamA: req.body.teamA,
                teamB: req.body.teamB,
                time: req.body.time,
                date: req.body.date,
                location: _location,
              },
            }
          )
            .exec()
            .then(() => {
              return res
                .status(200)
                .json({ status: 200, message: "fixture updated" });
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
});

router.delete("/:fixtureId", verifyToken, (req, res, next) => {
  jwt.verify(req.token, "secretKey", (err) => {
    if (err) {
      return res.json({
        status: 403,
        message: err,
      });
    }
    const id = req.params.fixtureId;
    Fixture.deleteOne({ _id: id })
      .exec()
      .then(() => {
        res.status(204).json({ status: 204, message: "Fixture deleted" });
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
