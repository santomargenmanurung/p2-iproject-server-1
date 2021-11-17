const midtransClient = require("midtrans-client");
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
      res.status(200).json({ accesss_token: token });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getAllEvent(req, res, next) {
    try {
      const { page, size, title } = req.query;
      const { limit, offset } = getPagination(page, size);
      let option = {
        where: {
          status: "avaliable",
        },
        limit,
        offset,
      };
      if (title) {
        option.where["title"] = {
          [Op.iLike]: `%${title}%`,
        };
      }
      const allEvent = await Event.findAndCountAll(option);
      const eventData = pagingData(allEvent, page, limit);
      if (eventData.totalItems === 0) {
        throw { name: "EVENT_NOT_FOUND" };
      }
      res.status(200).json(eventData);
    } catch (err) {
      next(err);
    }
  }

  static async detailEvent(req, res, next) {
    try {
      const eventId = Number(req.params.eventId);
      if (!eventId) {
        throw { name: "EVENT_NOT_FOUND" };
      }
      const event = await Event.findOne({
        where: { id: eventId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json(event);
    } catch (err) {
      next(err);
    }
  }
  static async getAllTiket(req, res, next) {
    try {
      const allTiket = await Tiket.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });
      res.status(200).json(allTiket);
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
  static async detailMyTikets(req, res, next) {
    try {
      const id = Number(req.params.ticketId);
      const detailMyTicket = await Tiket.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: Event,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      });
      res.status(200).json(detailMyTicket);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = CutomerController;
