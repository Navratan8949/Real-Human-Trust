const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");
const { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } = require("../controllers/team.controller");

// Public
router.get("/", getAllTeamMembers);

// Admin only
router.post("/", isAuthenticated, authorizeRoles(["super_admin", "admin"]), upload.single("photo"), createTeamMember);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin"]), upload.single("photo"), updateTeamMember);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin"]), deleteTeamMember);

module.exports = router;
