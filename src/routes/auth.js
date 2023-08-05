const { Router } = require("express");
const passport = require("passport");
const User = require("../database/schemas/User");
const { hashPassword } = require("../utils/helpers");

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
  console.log("Logged In");
  res.sendStatus(200);
});

router.post("/register", async (request, response) => {
  const { email } = request.body;
  const userDB = await User.findOne({ email });
  if (userDB) {
    response.status(400).send({ msg: "User already exists!" });
  } else {
    const password = hashPassword(request.body.password);
    console.log(password);
    const newUser = await User.create({ username, password, email });
    response.send(201);
  }
});

module.exports = router;
