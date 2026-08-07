const express = require("express");
const { applyVolunteer, getAllVolunteers, getVolunteerById, updateVolunteerStatus } = require("../controllers/volunteer.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Public route
router.post("/apply", applyVolunteer);

// Admin / Manager / Coordinator routes
router.get("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager", "coordinator"]), getAllVolunteers);
router.get("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager", "coordinator"]), getVolunteerById);
router.put("/:id/status", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager", "coordinator"]), updateVolunteerStatus);

module.exports = router;
