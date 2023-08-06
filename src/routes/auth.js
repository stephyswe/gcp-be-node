const { Router } = require("express");
const passport = require("passport");
const { authRegisterController } = require("../controllers/auth");
const User = require("../database/schemas/User");
const { hashPassword } = require("../utils/helpers");

const router = Router();

router.get("/env", function (req, res) {
  res.json({ env: process.env.NODE_ENV });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error:", err);
      return res.sendStatus(500);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error:", err);
        return res.sendStatus(500);
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect("/");
    });
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Logged In");
  res.sendStatus(200);
});

router.post("/register", authRegisterController);

router.get("/discord", passport.authenticate("discord"), (req, res) => {
  res.send(200);
});

router.get(
  "/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    //res.send(200);
    // then redirect the user's browser to the page you want
    res.redirect("/index.html");
  }
);

module.exports = router;
