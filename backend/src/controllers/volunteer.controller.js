const Volunteer = require("../models/Volunteer");

exports.applyVolunteer = async (req, res) => {
    try {
        const { fullName, email, mobile, address, message } = req.body;

        const volunteer = await Volunteer.create({
            fullName,
            email,
            mobile,
            address,
            message
        });

        res.status(201).json({ success: true, message: "Volunteer application submitted successfully", volunteer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort("-createdAt");
        res.status(200).json({ success: true, count: volunteers.length, volunteers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) return res.status(404).json({ success: false, message: "Volunteer not found" });
        res.status(200).json({ success: true, volunteer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateVolunteerStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!volunteer) return res.status(404).json({ success: false, message: "Volunteer not found" });

        res.status(200).json({ success: true, volunteer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
