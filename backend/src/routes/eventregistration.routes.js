const express = require("express");
const { registerForEvent, getMyEventRegistrations, getEventRegistrations, updateRegistrationStatus } = require("../controllers/eventRegistration.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Public route
router.post("/register", registerForEvent);

// Member routes
router.get("/me", isAuthenticated, getMyEventRegistrations);

// Admin / Manager routes
router.get("/event/:eventId", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getEventRegistrations);
router.put("/:id/status", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), updateRegistrationStatus);

module.exports = router;
