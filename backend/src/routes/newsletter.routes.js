const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const { subscribe, getAllSubscribers, deleteSubscriber, sendMassNewsletter } = require("../controllers/newsletter.controller");

// Public — subscribe
router.post("/subscribe", subscribe);

// Admin — view all subscribers
router.get("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getAllSubscribers);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin"]), deleteSubscriber);

// Admin — send mass email
router.post("/send", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), sendMassNewsletter);

module.exports = router;
