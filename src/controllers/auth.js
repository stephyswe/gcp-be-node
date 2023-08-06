const User = require("../database/schemas/User");
const { hashPassword } = require("../utils/helpers");

async function authRegisterController(request, response) {
  const { email } = request.body;
  const userDB = await User.findOne({ email });
  if (userDB) {
    response.status(400);
    response.send({ msg: "User already exists!" });
  } else {
    const password = hashPassword(request.body.password);
    const newUser = await User.create({ password, email });
    response.status(201).send({ msg: "User created!" });
  }
}

module.exports = { authRegisterController };
