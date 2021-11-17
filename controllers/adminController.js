const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User, Event, Tiket } = require("../models");

class AdminController {
  static async registerAdmin(req, res, next) {
    try {
      const { name, username, email, no_Identity, password } = req.body;
      const payload = {
        name: name,
        username: username,
        email: email,
        no_Identity: `A-${no_Identity}`,
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

  static async loginAdmin(req, res, next) {
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

  static async getAllEvet(req, res, next) {
    try {
      const allEvent = await Event.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json(allEvent);
    } catch (err) {
      next(err);
    }
  }

  static async addEvent(req, res, next) {
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

  static async updateStatusEvent(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;
