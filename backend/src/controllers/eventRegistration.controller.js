const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");
const Member = require("../models/Member");

exports.registerForEvent = async (req, res) => {
    try {
        const { eventId, fullName, email, mobile, remarks } = req.body;

        if (!eventId || !fullName || !email || !mobile) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Check registration deadline
        if (event.registrationLastDate && new Date() > new Date(event.registrationLastDate)) {
            return res.status(400).json({ success: false, message: "Registration deadline has passed" });
        }

        // Check max participants
        if (event.maxParticipants) {
            const currentRegistrations = await EventRegistration.countDocuments({ event: eventId, status: { $ne: "cancelled" } });
            if (currentRegistrations >= event.maxParticipants) {
                return res.status(400).json({ success: false, message: "Event is full" });
            }
        }

        // Check if already registered with this email for this event
        const existingRegistration = await EventRegistration.findOne({ email: email.toLowerCase(), event: eventId });
        if (existingRegistration) {
            return res.status(400).json({ success: false, message: "You are already registered for this event" });
        }

        // Let's try to link it to a member if the email matches a user who is a member
        const user = await require("../models/User").findOne({ email: email.toLowerCase() });
        let memberId = undefined;
        if (user) {
            const member = await Member.findOne({ user: user._id });
            if (member) memberId = member._id;
        }

        const registration = await EventRegistration.create({
            member: memberId,
            fullName,
            email: email.toLowerCase(),
            mobile,
            event: eventId,
            remarks,
            status: "registered"
        });

        res.status(201).json({ success: true, message: "Registered successfully", registration });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyEventRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;
        const member = await Member.findOne({ user: userId });
        if (!member) {
            return res.status(403).json({ success: false, message: "Member profile not found" });
        }

        const registrations = await EventRegistration.find({ member: member._id }).populate("event", "title eventDate location");
        res.status(200).json({ success: true, registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEventRegistrations = async (req, res) => {
    try {
        // Find registrations by event ID
        const registrations = await EventRegistration.find({ event: req.params.eventId })
            .populate({
                path: "member",
                populate: { path: "user", select: "fullName email mobile" }
            });
        res.status(200).json({ success: true, count: registrations.length, registrations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const registration = await EventRegistration.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true, runValidators: true }
        );

        if (!registration) {
            return res.status(404).json({ success: false, message: "Registration not found" });
        }

        res.status(200).json({ success: true, registration });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
