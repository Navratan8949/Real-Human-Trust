const Certificate = require("../models/Certificate");
const Member = require("../models/Member");
const { uploadOnCloudinary } = require("../utils/cloudinary");

exports.createCertificate = async (req, res) => {
    try {
        const { member, memberId, certificateNo, title, description, status } = req.body;
        const actualMemberId = member || memberId;
        let pdf = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) {
                pdf = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const memberDoc = await Member.findById(actualMemberId);
        if (!memberDoc) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        const certificate = await Certificate.create({
            member: actualMemberId,
            certificateNo,
            title,
            description,
            status,
            pdf
        });

        memberDoc.certificate.push(certificate._id);
        await memberDoc.save();

        const populatedCertificate = await Certificate.findById(certificate._id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        });

        res.status(201).json({ success: true, certificate: populatedCertificate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find().populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        }).sort("-issueDate");
        res.status(200).json({ success: true, count: certificates.length, certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyCertificates = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        const certificates = await Certificate.find({ member: member._id }).sort("-issueDate");
        res.status(200).json({ success: true, count: certificates.length, certificates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });

        const { member, memberId, certificateNo, title, description, status } = req.body;
        const actualMemberId = member || memberId;

        let pdf = certificate.pdf;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) {
                pdf = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const updatedCertificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            { member: actualMemberId || certificate.member, certificateNo, title, description, status, pdf },
            { new: true }
        );

        const populatedCertificate = await Certificate.findById(updatedCertificate._id).populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        });

        res.status(200).json({ success: true, certificate: populatedCertificate });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        if (!certificate) return res.status(404).json({ success: false, message: "Certificate not found" });

        // Remove from Member array
        await Member.updateOne(
            { _id: certificate.member },
            { $pull: { certificate: certificate._id } }
        );

        await certificate.deleteOne();
        res.status(200).json({ success: true, message: "Certificate deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
