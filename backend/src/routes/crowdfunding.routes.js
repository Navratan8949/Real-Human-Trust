const express = require("express");
const { createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign } = require("../controllers/crowdfunding.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), createCampaign);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), updateCampaign);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), deleteCampaign);

module.exports = router;
