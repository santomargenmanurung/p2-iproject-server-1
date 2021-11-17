const router = require("express").Router();
const AdminController = require("../controllers/adminController");

router.post("/register", AdminController.registerAdmin);
router.post("/login", AdminController.loginAdmin);
router.post("/events", AdminController.addEvent);
router.get("/events", AdminController.getAllEvet);
router.get("/events/:id", AdminController.detailEvent);
router.patch("/events/:id", AdminController.updateStatusEvent);
router.delete("/events/:id", AdminController.deleteEvent);

module.exports = router;
