const Complaint = require("../models/Complaint");
const Member = require("../models/Member");

exports.raiseComplaint = async (req, res) => {
    try {
        const { subject, message } = req.body;
        
        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(403).json({ success: false, message: "Member profile not found" });
        }

        const complaint = await Complaint.create({
            member: member._id,
            subject,
            message,
            status: "pending"
        });

        res.status(201).json({ success: true, message: "Complaint submitted successfully", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyComplaints = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(403).json({ success: false, message: "Member profile not found" });
        }

        const complaints = await Complaint.find({ member: member._id }).sort("-createdAt");
        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().populate({
            path: "member",
            populate: { path: "user", select: "fullName email mobile" }
        }).sort("-createdAt");
        
        res.status(200).json({ success: true, count: complaints.length, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email mobile" }
        }).populate("resolvedBy", "fullName email role");

        if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
        res.status(200).json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resolveComplaint = async (req, res) => {
    try {
        const { status, reply } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

        complaint.status = status || complaint.status;
        complaint.reply = reply || complaint.reply;
        
        if (status === "resolved" || status === "closed") {
            complaint.resolvedBy = req.user.id;
            complaint.resolvedAt = Date.now();
        }

        await complaint.save();
        res.status(200).json({ success: true, message: "Complaint updated successfully", complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
