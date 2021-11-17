const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User, Event, Tiket } = require("../models");

class CutomerController {
  static async registerCustomer(req, res, next) {
    try {
      const { name, username, email, no_Identity, password } = req.body;
      const payload = {
        name: name,
        username: username,
        email: email,
        no_Identity: `C-${no_Identity}`,
        password: password,
      };
      const newUser = await User.create(payload);
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (err) {
      next(err);
    }
  }

  static async loginCustomer(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "REQUIRED_EMAIL" };
      }
      if (!password) {
        throw { name: "REQUIRED_PASSWORD" };
      }
      const foundUser = await User.findOne({
        where: { email },
      });

      if (!foundUser || !comparePassword(password, foundUser.password)) {
        throw { name: "USER_NOT_FOUND" };
      }
      const payload = {
        id: foundUser.id,
        email: foundUser.email,
      };

      const token = generateToken(payload);
      res.status(200).json({ access_token: token });
    } catch (err) {
      next(err);
    }
  }

  static async getAllEvent(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }

  static async detailEvent(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }

  static async paymentTiket(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }
}
module.exports = CutomerController;
