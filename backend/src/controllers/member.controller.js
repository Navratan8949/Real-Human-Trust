const Member = require("../models/Member");
const User = require("../models/User");
const QRCode = require("qrcode");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const { SendVerificationCode } = require("../utils/sendMail");

const generateMemberId = () => {
    return "RHTM" + Math.floor(100000 + Math.random() * 900000);
};

exports.applyMembership = async (req, res) => {
    try {
        let {
            bloodGroup, occupation, membershipType, referredBy
        } = req.body;

        const userId = req.user.id;

        // Resolve referredBy string (e.g. "RHTM123456") to actual User ObjectId
        let resolvedReferrerId = null;
        if (referredBy && typeof referredBy === "string" && referredBy.trim() !== "") {
            const referrer = await Member.findOne({ memberId: { $regex: new RegExp(`^${referredBy.trim()}$`, "i") } });
            if (referrer) {
                resolvedReferrerId = referrer.user;
            } else {
                // Optionally try to find by User's full name if they typed a name
                const userReferrer = await User.findOne({ fullName: { $regex: new RegExp(`^${referredBy.trim()}$`, "i") } });
                if (userReferrer) {
                    resolvedReferrerId = userReferrer._id;
                }
            }
        }

        console.log("=== DEBUG APPLY MEMBERSHIP ===");
        console.log("req.body.referredBy:", referredBy);
        console.log("resolvedReferrerId:", resolvedReferrerId);
        console.log("type of resolvedReferrerId:", typeof resolvedReferrerId);


        let existingMember = await Member.findOne({ user: userId });
        if (existingMember && existingMember.membershipStatus !== "rejected") {
            return res.status(400).json({ success: false, message: "Membership already applied." });
        }

        const memberId = existingMember ? existingMember.memberId : generateMemberId();

        // Handle profileImage upload (for ID card — can differ from login profile pic)
        let profileImage = existingMember ? existingMember.profileImage : { public_id: "", url: "" };
        const profileFile = req.files && req.files["profileImage"] ? req.files["profileImage"][0] : null;
        if (profileFile) {
            const uploadResult = await uploadOnCloudinary(profileFile.path);
            if (uploadResult) {
                profileImage = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        // Handle idProof upload (Aadhar / PAN / Voter ID)
        let idProof = existingMember ? existingMember.idProof : { public_id: "", url: "" };
        const idProofFile = req.files && req.files["idProof"] ? req.files["idProof"][0] : null;
        if (idProofFile) {
            const uploadResult = await uploadOnCloudinary(idProofFile.path);
            if (uploadResult) {
                idProof = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        let member;
        if (existingMember) {
            existingMember.bloodGroup = bloodGroup || "";
            existingMember.occupation = occupation || "";
            existingMember.membershipType = membershipType || "general";
            existingMember.referredBy = resolvedReferrerId;
            existingMember.profileImage = profileImage;
            existingMember.idProof = idProof;
            existingMember.membershipStatus = "pending";
            existingMember.rejectionReason = "";
            await existingMember.save();
            member = existingMember;
        } else {
            member = await Member.create({
                user: userId,
                memberId,
                bloodGroup: bloodGroup || "",
                occupation: occupation || "",
                membershipType: membershipType || "general",
                referredBy: resolvedReferrerId,
                profileImage,
                idProof,
                membershipStatus: "pending",
            });
        }

        res.status(201).json({ success: true, message: "Membership application submitted successfully.", member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getAllMembers = async (req, res) => {
    try {
        const members = await Member.find().populate("user", "fullName email mobile role").sort("-createdAt");
        res.status(200).json({ success: true, count: members.length, members });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id).populate("user", "fullName email");
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        member.membershipStatus = "approved";

        // Generate QR Code containing member verification link
        const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-member/${member.memberId}`;
        const qrCodeData = await QRCode.toDataURL(verificationLink);

        member.qrCode = qrCodeData;

        await member.save();

        // Send Email Notification
        if (member.user && member.user.email) {
            const userEmail = member.user.email;
            const userName = member.user.fullName;
            try {
                await SendVerificationCode(
                    userEmail,
                    `<p>Dear ${userName},</p><p>Congratulations! Your membership application has been approved.</p><p>Your unique Member ID is: <strong>${member.memberId}</strong></p><p>You can now log in to the Member Dashboard to access your profile, ID card, and exclusive features.</p><p>Welcome to the team!</p><p>Best Regards,<br/>Real Human Trust Team</p>`,
                    "Membership Approved - Real Human Trust",
                    `Dear ${userName},\n\nCongratulations! Your membership application has been approved.\nYour unique Member ID is: ${member.memberId}\n\nYou can now log in to the Member Dashboard to access your profile, ID card, and exclusive features.\n\nWelcome to the team!\n\nBest Regards,\nReal Human Trust Team`
                );
            } catch (emailError) {
                console.error("Error sending approval email:", emailError);
            }
        }

        res.status(200).json({ success: true, message: "Member approved and QR Code generated", member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rejectMember = async (req, res) => {
    try {
        const { reason } = req.body;
        const member = await Member.findById(req.params.id).populate("user", "fullName email");
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        member.membershipStatus = "rejected";
        member.rejectionReason = reason || "No reason provided by administration.";
        await member.save();

        // Send Email Notification
        if (member.user && member.user.email) {
            const userEmail = member.user.email;
            const userName = member.user.fullName;
            try {
                await SendVerificationCode(
                    userEmail,
                    `<p>Dear ${userName},</p><p>We regret to inform you that your membership application has been rejected at this time.</p><p><strong>Reason provided by administration:</strong><br/>${reason || "No reason provided by administration."}</p><p>If you have any questions, please contact our support team.</p><p>Best Regards,<br/>Real Human Trust Team</p>`,
                    "Membership Application Status - Real Human Trust",
                    `Dear ${userName},\n\nWe regret to inform you that your membership application has been rejected at this time.\n\nReason provided by administration:\n${reason || "No reason provided by administration."}\n\nIf you have any questions, please contact our support team.\n\nBest Regards,\nReal Human Trust Team`
                );
            } catch (emailError) {
                console.error("Error sending rejection email:", emailError);
            }
        }

        res.status(200).json({ success: true, message: "Member application rejected", member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user.id }).populate("user", "fullName email mobile");
        if (!member) {
            return res.status(404).json({ success: false, message: "Membership details not found" });
        }
        res.status(200).json({ success: true, member });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createMemberDirectly = async (req, res) => {
    try {
        const { fullName, email, mobile, password, bloodGroup, occupation, membershipType } = req.body;
        const bcrypt = require("bcryptjs");

        if (!fullName || !email || !mobile) {
            return res.status(400).json({ success: false, message: "Please provide fullName, email, and mobile" });
        }

        // 1. Check if user exists
        let user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (!user) {
            // Create user
            if (!password) {
                return res.status(400).json({ success: false, message: "Please provide a password for the new user account" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user = await User.create({
                fullName, email, mobile, password: hashedPassword, role: "member"
            });
        }

        // 2. Check if member already exists for this user
        const existingMember = await Member.findOne({ user: user._id });
        if (existingMember) {
            return res.status(400).json({ success: false, message: "This user is already a member" });
        }

        const memberId = generateMemberId();

        // 3. Create member (auto-approved since admin is adding)
        const member = await Member.create({
            user: user._id,
            memberId,
            bloodGroup: bloodGroup || "",
            occupation: occupation || "",
            membershipType: membershipType || "general",
            createdBy: req.user.id,
            membershipStatus: "approved",
        });

        // 4. Generate QR Code
        const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-member/${member.memberId}`;
        member.qrCode = await QRCode.toDataURL(verificationLink);
        await member.save();

        const populatedMember = await Member.findById(member._id).populate("user", "fullName email mobile role");

        // Send Email Notification
        if (populatedMember.user && populatedMember.user.email) {
            const userEmail = populatedMember.user.email;
            const userName = populatedMember.user.fullName;
            const loginInfo = !password ? "" : `\nYour account has been created with this email. Password: ${password}\n`;
            const loginInfoHtml = !password ? "" : `<p>Your account has been created with this email. Password: <strong>${password}</strong></p>`;
            try {
                await SendVerificationCode(
                    userEmail,
                    `<p>Dear ${userName},</p><p>Your membership has been successfully created by the administration.</p><p>Your unique Member ID is: <strong>${member.memberId}</strong></p>${loginInfoHtml}<p>You can log in to the Member Dashboard to access your profile, ID card, and exclusive features.</p><p>Welcome to the team!</p><p>Best Regards,<br/>Real Human Trust Team</p>`,
                    "Welcome to Real Human Trust - Membership Created",
                    `Dear ${userName},\n\nYour membership has been successfully created by the administration.\nYour unique Member ID is: ${member.memberId}\n${loginInfo}\nYou can log in to the Member Dashboard to access your profile, ID card, and exclusive features.\n\nWelcome to the team!\n\nBest Regards,\nReal Human Trust Team`
                );
            } catch (emailError) {
                console.error("Error sending creation email:", emailError);
            }
        }

        res.status(201).json({ success: true, message: "Member created and approved successfully", data: populatedMember });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
