const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
    {
        // Link to the User account (login)
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        // Unique NGO Member ID (e.g. RHTM123456)
        memberId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        // Member profile photo (separate from user profileImage, for ID card use)
        profileImage: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
        },

        // ID Proof (Aadhar / PAN / Voter ID image or PDF)
        idProof: {
            public_id: { type: String, default: "" },
            url: { type: String, default: "" },
        },

        // NGO-specific fields (NOT duplicated from User)
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
            default: "",
        },

        occupation: {
            type: String,
            trim: true,
            default: "",
        },

        membershipType: {
            type: String,
            enum: ["general", "lifetime", "honorary", "student"],
            default: "general",
        },

        joiningDate: {
            type: Date,
            default: Date.now,
        },

        membershipStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "cancelled"],
            default: "pending",
        },

        rejectionReason: {
            type: String,
            default: "",
            trim: true
        },

        // QR Code (generated after approval)
        qrCode: {
            type: String,
            default: "",
        },

        appointmentLetter: {
            type: String,
            default: "",
        },

        certificate: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Certificate",
            },
        ],

        // Coordinator referral tracking
        referredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Member", memberSchema);