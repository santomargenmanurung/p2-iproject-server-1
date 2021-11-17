const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const payload = verifyToken(access_token);
    const foundUser = await User.findByPk(payload.id);

    if (!foundUser) {
      throw { name: "INVALID_TOKEN" };
    }
    req.user = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      no_Identity: foundUser.no_Identity,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authentication;
