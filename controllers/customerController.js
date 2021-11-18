const midtransClient = require("midtrans-client");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const generatePassword = require("password-generator");
const { getPagination, pagingData } = require("../helpers/mekanismPagination");

const sendEmail = require("../helpers/nodemailer");
const { User, Event, Ticket, MyTicket } = require("../models");

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
      const content = `Hi ${newUser.name}!, your account with email ${newUser.email} successfully registered.`;
      const subject = `Information Registered`;
      sendEmail(newUser, content, subject);
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
      res
        .status(200)
        .json({ access_token: token, no_Identity: foundUser.no_Identity });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const { id_token } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const emailGoogle = payload.email;
      const nameGoogle = payload.name;
      const password = "password".toString(64) + "!@152";

      const [user, created] = await User.findOrCreate({
        where: { email: emailGoogle },
        defaults: {
          name: nameGoogle,
          username: nameGoogle,
          email: emailGoogle,
          password: password + "!@152",
          no_identity: `C-${generatePassword(8)}}`,
        },
      });
      const content = `Hi ${nameGoogle}!,your account with email ${emailGoogle} successfully registered.`;
      const subject = `Information Registrasion`;
      sendEmail(payload, content, subject);

      const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
      };

      const token = createToken(tokenPayload);
      if (created) {
        res.status(201).json({
          access_token: token,
          id: user.id,
          role: user.role,
          username: user.username,
        });
      } else {
        res.status(200).json({
          access_token: token,
          id: user.id,
          role: user.role,
          username: user.username,
        });
      }
    } catch (err) {
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
      console.log(err);
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
  static async getAllTciket(req, res, next) {
    try {
      const allTciket = await Ticket.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: Event,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      });
      res.status(200).json(allTciket);
    } catch (err) {
      next(err);
    }
  }
  static async myTicket(req, res, next) {
    try {
      const allMyTicket = await MyTicket.findAll({
        where: { UserId: req.user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: Ticket,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: {
            model: Event,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      });
      res.status(200).json(allMyTicket);
    } catch (err) {
      next(err);
    }
  }

  static async addTicket(req, res, next) {
    try {
      const id = Number(req.params.ticketId);
      const { id: UserId } = req.user;
      if (!id) {
        throw { name: "TICKET_NOT_FOUND" };
      }
      const foundTicket = await Ticket.findByPk(id);
      if (!foundTicket) {
        throw { name: "TICKET_NOT_FOUND" };
      }
      const myTicket = await MyTicket.create({
        TicketId: id,
        UserId: UserId,
      });
      res.status(201).json({
        id: myTicket.id,
        TicketId: myTicket.TicketId,
        UserId: myTicket.UserId,
      });
    } catch (err) {
      next(err);
    }
  }

  static async paymentTicket(req, res, next) {
    try {
      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: generatePassword(8),
          gross_amount: 200000,
        },
        credit_card: {
          secure: true,
        },
      };
      let transaction = await snap.createTransaction(parameter);
      const content = `Hi ${req.user.name}!, please click the link ${transaction.redirect_url} to continue the payment `;
      const subject = `Information Payment`;
      sendEmail(req.user, content, subject);
      res.status(200).json({ transaction });
    } catch (err) {
      next(err);
    }
  }
  static async detailMyTickets(req, res, next) {
    try {
      const id = Number(req.params.MyTicketId);
      const detailMyTicket = await MyTicket.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: Ticket,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: {
            model: Event,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        },
      });
      res.status(200).json(detailMyTicket);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = CutomerController;
