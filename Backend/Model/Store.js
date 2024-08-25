import mongoose from "mongoose";

// Defining the Store Schema
const storeSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Quantity: {
        type: String,
        required: true,
    },
    Price: {
        type: String,
        required: true,
    },
});

// Exporting the Store Model
export const Store = mongoose.model('Store', storeSchema);