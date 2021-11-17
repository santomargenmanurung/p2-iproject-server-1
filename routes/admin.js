const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const AdminController = require("../controllers/adminController");
const authentication = require("../middlewares/authentication");
const authorizationNewEvent = require("../middlewares/authorizationAdd");
const uploadImageKit = require("../middlewares/imageKitUpload");

router.post("/register", AdminController.registerAdmin);
router.post("/login", AdminController.loginAdmin);
router.get("/events", AdminController.getAllEvet);
router.get("/events/:eventId", AdminController.detailEvent);
router.use(authentication);
router.use(authorizationNewEvent);
router.post(
  "/events",
  upload.single("posterUrl"),
  uploadImageKit,
  AdminController.addEvent
);
router.patch("/events/:id", AdminController.updateStatusEvent);
router.patch("/tikets/:ticketId", AdminController.updateStatusTiket);
router.delete("/events/:id", AdminController.deleteEvent);

module.exports = router;
