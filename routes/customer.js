const CutomerController = require("../controllers/customerController");
const authentication = require("../middlewares/authentication");
const router = require("express").Router();

router.post("/register", CutomerController.registerCustomer);
router.post("/login", CutomerController.loginCustomer);
router.get("/events", CutomerController.getAllEvent);
router.get("/events/:eventId", CutomerController.detailEvent);
router.use(authentication);
router.get("/myTicket", CutomerController.myTicket);
router.post("/ticket/:ticketId", CutomerController.addTicket);
router.get("/tickets", CutomerController.getAllTciket);
router.get("/payment", CutomerController.paymentTicket);
router.get("/myTicket/:MyTicketId", CutomerController.detailMyTickets);

module.exports = router;
