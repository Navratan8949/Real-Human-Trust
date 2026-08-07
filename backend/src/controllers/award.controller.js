const Award = require("../models/Award");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Public — Get all active awards
exports.getAllAwards = async (req, res) => {
    try {
        const awards = await Award.find({ status: "active" }).sort("-year");
        res.status(200).json({ success: true, count: awards.length, awards });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Create award
exports.createAward = async (req, res) => {
    try {
        const { title, description, awardedBy, year } = req.body;

        let image = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) image = { public_id: uploadResult.public_id, url: uploadResult.url };
        }

        const award = await Award.create({
            title,
            description,
            awardedBy,
            year,
            image,
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, award });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Update award
exports.updateAward = async (req, res) => {
    try {
        const award = await Award.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!award) return res.status(404).json({ success: false, message: "Award not found" });
        res.status(200).json({ success: true, award });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Delete award
exports.deleteAward = async (req, res) => {
    try {
        const award = await Award.findByIdAndDelete(req.params.id);
        if (!award) return res.status(404).json({ success: false, message: "Award not found" });
        res.status(200).json({ success: true, message: "Award deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
