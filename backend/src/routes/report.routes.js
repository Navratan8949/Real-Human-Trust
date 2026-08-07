const express = require("express");
const { createReport, getAllReports, getReportById, deleteReport } = require("../controllers/report.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

// Public route
router.get("/", getAllReports);
router.get("/:id", getReportById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["admin", "manager"]), upload.single("pdf"), createReport);
router.delete("/:id", isAuthenticated, authorizeRoles(["admin", "manager"]), deleteReport);

module.exports = router;
