const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get all staff members (excluding super_admin and normal members)
exports.getStaff = async (req, res) => {
    try {
        const staff = await User.find({
            role: { $in: ["super_admin", "admin", "manager", "coordinator"] }
        }).select("-password");
        
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all public web users (role: member)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "member" }).select("-password").sort("-createdAt");
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create new staff
exports.createStaff = async (req, res) => {
    try {
        const { fullName, email, mobile, password, role } = req.body;

        if (!fullName || !email || !mobile || !password || !role) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const validRoles = ["admin", "manager", "coordinator"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role specified" });
        }

        const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User with this email or mobile already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staff = await User.create({
            fullName,
            email,
            mobile,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ success: true, message: "Staff created successfully", data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update staff
exports.updateStaff = async (req, res) => {
    try {
        const { fullName, email, mobile, role, isActive } = req.body;
        
        const staff = await User.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }

        // Only super_admin can edit other super_admins
        if (staff.role === "super_admin" && req.user.role !== "super_admin") {
            return res.status(403).json({ success: false, message: "Cannot edit a super_admin" });
        }

        if (fullName) staff.fullName = fullName;
        if (email) staff.email = email;
        if (mobile) staff.mobile = mobile;
        if (role && ["admin", "manager", "coordinator"].includes(role)) staff.role = role;
        if (isActive !== undefined) staff.isActive = isActive;

        await staff.save();

        res.status(200).json({ success: true, message: "Staff updated successfully", data: staff });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete staff
exports.deleteStaff = async (req, res) => {
    try {
        const staff = await User.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }

        if (staff.role === "super_admin") {
            return res.status(403).json({ success: false, message: "Cannot delete a super admin" });
        }

        await staff.deleteOne();

        res.status(200).json({ success: true, message: "Staff deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
