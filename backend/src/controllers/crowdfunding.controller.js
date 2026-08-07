const Crowdfunding = require("../models/Crowdfunding");
const { uploadOnCloudinary } = require("../utils/cloudinary");

exports.createCampaign = async (req, res) => {
    try {
        const { project, title, description, targetAmount, startDate, endDate, status } = req.body;

        let image = { public_id: "", url: "" };
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) {
                image = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        const campaign = await Crowdfunding.create({
            project,
            title,
            description,
            targetAmount,
            startDate,
            endDate,
            status,
            image
        });

        res.status(201).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Crowdfunding.find().populate("project", "title");
        res.status(200).json({ success: true, count: campaigns.length, campaigns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCampaignById = async (req, res) => {
    try {
        const campaign = await Crowdfunding.findById(req.params.id).populate("project", "title description");
        if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });
        res.status(200).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCampaign = async (req, res) => {
    try {
        let campaign = await Crowdfunding.findById(req.params.id);
        if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });

        const updatedData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) {
                updatedData.image = { public_id: uploadResult.public_id, url: uploadResult.url };
            }
        }

        campaign = await Crowdfunding.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
        res.status(200).json({ success: true, campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCampaign = async (req, res) => {
    try {
        const campaign = await Crowdfunding.findById(req.params.id);
        if (!campaign) return res.status(404).json({ success: false, message: "Campaign not found" });

        await campaign.deleteOne();
        res.status(200).json({ success: true, message: "Campaign deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
