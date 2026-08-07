const express = require("express");
const { createOrder, verifyPayment, getAllDonations, getMyDonations, createManualDonation, verifyManualDonation } = require("../controllers/donation.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const checkOptionalAuth = isAuthenticated.checkOptionalAuth;

const router = express.Router();

router.post("/create-order", checkOptionalAuth, createOrder);
router.post("/verify-payment", checkOptionalAuth, verifyPayment);
router.get("/me", isAuthenticated, getMyDonations);

// Manual Donation Routes
router.post("/manual", checkOptionalAuth, upload.single("paymentProof"), createManualDonation);

// Admin route
router.get("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getAllDonations);
router.put("/:id/verify", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), verifyManualDonation);

module.exports = router;
