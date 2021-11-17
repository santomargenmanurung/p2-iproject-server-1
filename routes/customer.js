const CutomerController = require("../controllers/customerController");
const authentication = require("../middlewares/authentication");
const router = require("express").Router();

router.post("/register", CutomerController.registerCustomer);
router.post("/login", CutomerController.loginCustomer);
router.get("/events", CutomerController.getAllEvent);
router.get("/events/:eventId", CutomerController.detailEvent);
router.use(authentication);
router.get("/tickets", CutomerController.getAllTiket);
router.post("/tickets/:ticketId", CutomerController.paymentTiket);
router.get("/myTicket/:ticketId", CutomerController.detailMyTikets);

module.exports = router;
