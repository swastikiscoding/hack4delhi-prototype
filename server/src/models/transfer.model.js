import mongoose from "mongoose";

const TransferRequestSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true
    },
    epicId: {
        type: String,
        required: true
    },
    toAddress: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const TransferRequest = mongoose.model("TransferRequest", TransferRequestSchema);