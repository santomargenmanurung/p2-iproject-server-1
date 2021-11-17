const CutomerController = require("../controllers/customerController");
const router = require("express").Router();

router.post("/register", CutomerController.registerCustomer);
router.post("/login", CutomerController.loginCustomer);
router.get("/events", CutomerController.getAllEvent);
router.get("/events/:id", CutomerController.detailEvent);
router.post("/events/:id", CutomerController.paymentTiket);

module.exports = router;
