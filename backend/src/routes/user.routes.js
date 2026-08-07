const express = require("express");
const { getStaff, createStaff, updateStaff, deleteStaff, getAllUsers } = require("../controllers/user.controller");
const isAuthenticated = require("../middleware/auth");
const authorizeRoles = require("../middleware/role");

const router = express.Router();

// Allow admins to view public web users
router.get("/public", isAuthenticated, authorizeRoles(["super_admin", "admin", "manager"]), getAllUsers);

// Only super_admin can manage staff
router.use(isAuthenticated, authorizeRoles(["super_admin"]));

router.get("/", getStaff);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;
