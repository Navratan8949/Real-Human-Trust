const express = require("express");
const { submitContactEnquiry, getAllEnquiries, getEnquiryById, updateEnquiryStatus } = require("../controllers/contact.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Public route
router.post("/", submitContactEnquiry);

// Admin / Manager routes
router.get("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getAllEnquiries);
router.get("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getEnquiryById);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), updateEnquiryStatus);

module.exports = router;
