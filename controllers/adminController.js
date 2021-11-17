const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { getPagination, pagingData } = require("../helpers/mekanismPagination");
const { Op } = require("sequelize");
const { User, Event, Ticket } = require("../models");

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

  static async addEvent(req, res, next) {
    try {
      const { title, date, posterUrl, capacity, held_In, description } =
        req.body;
      const { id: UserId } = req.user;
      const payloaad = {
        title,
        date,
        posterUrl,
        capacity,
        held_In,
        description,
      };
      const newEvent = await Event.create(payloaad);
      const EventId = newEvent.id;

      if (newEvent) {
        await Ticket.create({
          EventId,
        });
      }
      res.status(201).json({
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.date,
        posterUrl: newEvent.posterUrl,
        capacity: newEvent.capacity,
        held_In: newEvent.title,
        description: newEvent.description,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatusEvent(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      if (!id) {
        throw { name: "EVENT_NOT_FOUND" };
      }
      const foundEvent = await Event.findByPk(id);
      if (!foundEvent) {
        throw { name: "EVENT_NOT_FOUND" };
      }
      await Event.update(
        {
          status,
        },
        {
          where: { id },
          returning: true,
        }
      );
      res
        .status(200)
        .json({ message: `status event ${foundEvent.title} has been updated` });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatusTiket(req, res, next) {
    try {
      const id = Number(req.params.ticketId);
      const { status } = req.body;

      if (!id) {
        throw { name: "TIKET_NOT_FOUND" };
      }
      const foundTiket = await Ticket.findByPk(id);

      if (!foundTiket) {
        throw { name: "TIKET_NOT_FOUND" };
      }
      await Ticket.update(
        {
          status,
        },
        {
          where: { id },
          returning: true,
        }
      );
      res.status(200).json({ message: `status Tiket has been updated` });
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    try {
      const id = Number(req.params.id);
      const foundEvent = await Event.findByPk(id);
      console.log(foundEvent.status);

      if (!id) {
        throw { name: "EVENT_NOT_FOUND" };
      }
      if (!foundEvent) {
        throw { name: "EVENT_NOT_FOUND" };
      }

      if (foundEvent.status !== "done") {
        throw { name: "CANT_DELETE" };
      }
      await Event.destroy({
        where: { id },
      });
      res
        .status(200)
        .json({ message: `Event ${foundEvent.title} has been deleted` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;
