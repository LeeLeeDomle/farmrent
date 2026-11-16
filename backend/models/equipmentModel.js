import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: ["tractor", "tiller", "irrigation", "harvester"],
            lowercase: true,
            trim: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        image: {
            type: String,
            required: true,
            trim: true
        },

        availability: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available"
        },

        rentalPeriod: {
            type: String,
            default: "day"
        }
    },
    {
        timestamps: true
    }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;