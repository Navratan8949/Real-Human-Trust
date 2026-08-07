const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");
const { createCertificate, getAllCertificates, getMyCertificates, updateCertificate, deleteCertificate } = require("../controllers/certificate.controller");

// Member routes
router.get("/me", isAuthenticated, getMyCertificates);

// Admin routes
router.get("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getAllCertificates);
router.post("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("pdf"), createCertificate);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("pdf"), updateCertificate);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), deleteCertificate);

module.exports = router;
