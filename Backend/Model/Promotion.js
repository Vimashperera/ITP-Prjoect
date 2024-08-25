import mongoose from "mongoose";

// Defining the Promotion Schema
const promotionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

// Exporting the Promotion Model
export const Promotion = mongoose.model('Promotion', promotionSchema);
