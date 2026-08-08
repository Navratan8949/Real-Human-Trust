const SiteContent = require("../models/SiteContent");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Public — Get content by key (e.g. "founder_message", "vision_mission")
exports.getContentByKey = async (req, res) => {
    try {
        const content = await SiteContent.findOne({ key: req.params.key });
        if (!content) return res.status(404).json({ success: false, message: "Content not found" });
        res.status(200).json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Public — Get all site content (for frontend to load all at once)
exports.getAllContent = async (req, res) => {
    try {
        const contents = await SiteContent.find();
        res.status(200).json({ success: true, contents });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Create or Update content by key (upsert)
exports.upsertContent = async (req, res) => {
    try {
        const { key, title, content, content_hi, content_gu } = req.body;

        let image = undefined;
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) image = { public_id: uploadResult.public_id, url: uploadResult.url };
        }

        const updateData = {
            title,
            content,
            content_hi,
            content_gu,
            updatedBy: req.user._id,
        };
        if (image) updateData.image = image;

        const siteContent = await SiteContent.findOneAndUpdate(
            { key },
            updateData,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ success: true, siteContent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Delete content
exports.deleteContent = async (req, res) => {
    try {
        const content = await SiteContent.findByIdAndDelete(req.params.id);
        if (!content) return res.status(404).json({ success: false, message: "Content not found" });
        res.status(200).json({ success: true, message: "Content deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin — Upload Media Standalone
exports.uploadMedia = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: "No file provided" });
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) throw new Error("Cloudinary upload failed");
        res.status(200).json({ success: true, url: uploadResult.url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
