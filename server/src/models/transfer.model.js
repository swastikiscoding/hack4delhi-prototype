import mongoose from "mongoose";

const TransferRequestSchema = new mongoose.Schema({
    // On-chain identifier (keccak256(utf8(epicId)))
    epicHash: {
        type: String,
        required: true,
        index: true
    },
    epicId: {
        type: String,
        required: true,
        index: true
    },

    fromState: {
        type: String,
        required: true
    },
    fromStateNumber: {
        type: Number,
        required: true
    },
    fromConstituency: {
        type: Number,
        required: true
    },

    toState: {
        type: String,
        required: true
    },
    toStateNumber: {
        type: Number,
        required: true
    },
    toConstituency: {
        type: Number,
        required: true
    },

    // Off-chain application payload
    toAddress: {
        type: String,
        required: true
    },
    proof: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "PENDING_BLO",
            "BLO_VERIFIED",
            "BLO_REJECTED",
            "ERO_APPROVED",
            "ERO_REJECTED"
        ],
        default: "PENDING_BLO",
        index: true
    },

    // Officer audit trail (off-chain)
    bloAddress: { type: String },
    bloVerifiedAt: { type: Date },
    bloTxHash: { type: String },
    requestMigrationTxHash: { type: String },

    eroAddress: { type: String },
    eroDecidedAt: { type: Date },
    eroTxHash: { type: String }
}, {timestamps: true});

TransferRequestSchema.index({ epicId: 1, status: 1 });
TransferRequestSchema.index({ epicHash: 1, status: 1 });

export const TransferRequest = mongoose.model("TransferRequest", TransferRequestSchema);