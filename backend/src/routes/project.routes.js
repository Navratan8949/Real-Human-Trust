const express = require("express");
const { createProject, getAllProjects, getProjectById, updateProject, deleteProject } = require("../controllers/project.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), createProject);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), updateProject);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), deleteProject);

module.exports = router;
