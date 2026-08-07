const express = require("express");
const { createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial } = require("../controllers/testimonial.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

// Public route (to fetch active testimonials for website)
router.get("/", getAllTestimonials);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), createTestimonial);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), updateTestimonial);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), deleteTestimonial);

module.exports = router;
