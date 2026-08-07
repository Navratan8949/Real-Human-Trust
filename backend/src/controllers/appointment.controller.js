const AppointmentLetter = require("../models/AppointmentLetter");
const Member = require("../models/Member");
const pdf = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const generateLetterNo = () => {
    return "RHT-AL-" + Date.now().toString().slice(-6);
};

exports.createAppointmentLetter = async (req, res) => {
    try {
        const { memberId, designation, department, joiningDate } = req.body;

        const member = await Member.findById(memberId).populate("user");
        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        const letterNo = generateLetterNo();

        // 1. Generate PDF
        const pdfFileName = `${letterNo}.pdf`;
        const localPdfPath = path.join(__dirname, "..", "..", "public", "uploads", "appointments", pdfFileName);
        
        // Ensure directory exists
        const dirPath = path.dirname(localPdfPath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const doc = new pdf();
        const writeStream = fs.createWriteStream(localPdfPath);
        doc.pipe(writeStream);

        doc.fontSize(22).text("Real Human Education & Charitable Trust", { align: "center", underline: true });
        doc.moveDown();
        doc.fontSize(16).text("APPOINTMENT LETTER", { align: "center" });
        doc.moveDown();
        
        doc.fontSize(12).text(`Letter No: ${letterNo}`, { align: "right" });
        doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
        doc.moveDown();

        doc.text(`To,`);
        doc.text(`Name: ${member.user.fullName}`);
        doc.text(`Member ID: ${member.memberId}`);
        doc.text(`Email: ${member.user.email}`);
        doc.moveDown();

        doc.text(`Subject: Appointment for the position of ${designation}`, { underline: true });
        doc.moveDown();

        doc.text(`Dear ${member.user.fullName},`);
        doc.moveDown();
        doc.text(`We are pleased to appoint you as ${designation} in the ${department || "General"} department at Real Human Education & Charitable Trust.`);
        doc.text(`Your effective joining date is ${new Date(joiningDate).toLocaleDateString()}.`);
        doc.moveDown();
        doc.text("We believe your skills and experience will be an excellent match for our organization. We look forward to your positive impact in our NGO's mission.");
        doc.moveDown(2);
        
        doc.text("Sincerely,");
        doc.moveDown();
        
        const signaturePath = path.join(__dirname, "..", "..", "public", "images", "signature.png");
        if (fs.existsSync(signaturePath)) {
            doc.image(signaturePath, { width: 120 });
            doc.moveDown(0.2);
        } else {
            doc.text("_______________________");
        }
        
        doc.text("Authorized Signatory");
        doc.text("Real Human Education & Charitable Trust");
        
        doc.end();

        // 2. Save to database when PDF is completely written
        writeStream.on("finish", async () => {
            try {
                const pdfUrl = `http://localhost:8000/public/uploads/appointments/${pdfFileName}`;
                
                const appointmentLetter = await AppointmentLetter.create({
                    member: memberId,
                    letterNo,
                    designation,
                    department,
                    joiningDate,
                    pdf: { public_id: "", url: pdfUrl }
                });

                const populatedLetter = await AppointmentLetter.findById(appointmentLetter._id).populate({
                    path: "member",
                    populate: { path: "user", select: "fullName email" }
                });

                res.status(201).json({ success: true, message: "Appointment letter generated successfully", appointmentLetter: populatedLetter });
            } catch (saveError) {
                console.error(saveError);
                res.status(500).json({ success: false, message: "Failed to save appointment letter" });
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllAppointmentLetters = async (req, res) => {
    try {
        const letters = await AppointmentLetter.find().populate({
            path: "member",
            populate: { path: "user", select: "fullName email" }
        }).sort("-createdAt");

        res.status(200).json({ success: true, count: letters.length, letters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyAppointmentLetters = async (req, res) => {
    try {
        const member = await Member.findOne({ user: req.user.id });
        if (!member) {
            return res.status(404).json({ success: false, message: "Member profile not found" });
        }

        const letters = await AppointmentLetter.find({ member: member._id }).sort("-createdAt");
        res.status(200).json({ success: true, count: letters.length, letters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
