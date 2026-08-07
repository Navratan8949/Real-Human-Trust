const express = require("express");
const { createNews, getAllNews, getNewsById, updateNews, deleteNews } = require("../controllers/news.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");
const upload = require("../utils/multer");

const router = express.Router();

router.get("/", getAllNews);
router.get("/:id", getNewsById);

// Admin / Manager routes
router.post("/", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), createNews);
router.put("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), upload.single("image"), updateNews);
router.delete("/:id", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), deleteNews);

module.exports = router;
