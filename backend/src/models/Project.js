const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        image: {
            public_id: {
                type: String,
                default: "",
            },
            url: {
                type: String,
                default: "",
            },
        },

        goalAmount: {
            type: Number,
            default: 0,
        },

        raisedAmount: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ["active", "completed", "upcoming"],
            default: "active",
        },

        startDate: {
            type: Date,
        },

        endDate: {
            type: Date,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Project", projectSchema);