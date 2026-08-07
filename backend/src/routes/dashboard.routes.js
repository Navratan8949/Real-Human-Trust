const express = require("express");
const { getDashboardStats } = require("../controllers/dashboard.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Admin / Manager routes
router.get("/stats", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getDashboardStats);

module.exports = router;
