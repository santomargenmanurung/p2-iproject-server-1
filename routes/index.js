const router = require("express").Router();
const admin = require("../routes/admin");
const customer = require("../routes/customer");
const errorHandler = require("../middlewares/errorHandler");

router.use("/admin", admin);
router.use("/customer", customer);

router.use(errorHandler);

module.exports = router;
