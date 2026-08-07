const express = require("express");
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/event.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), createEvent);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), updateEvent);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), deleteEvent);

module.exports = router;
