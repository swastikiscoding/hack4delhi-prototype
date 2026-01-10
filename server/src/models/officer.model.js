import mongoose from "mongoose";
import { STATE_NUMBER_MAP } from "./statemap.js";

const officerSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        enum: ["STATE_EC", "ERO", "BLO"],
    },
    name: {
        type: String,
        trim: true,
        default: ""
    },
    // For STATE_EC, this is the state they manage
    // For ERO/BLO, this is the state they belong to
    state: {
        type: String,
        enum: [...Object.keys(STATE_NUMBER_MAP), ""],
        default: ""
    },
    stateNumber: {
        type: Number,
    },
    // For ERO/BLO: constituency they're assigned to
    constituencyCode: {
        type: String,
        default: ""
    },
    constituencyName: {
        type: String,
        default: ""
    },
    // Wallet address of the State EC that added this officer
    addedBy: {
        type: String,
        lowercase: true,
    },
    // Transaction hash of the blockchain transaction
    txHash: {
        type: String,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "REVOKED"],
        default: "ACTIVE"
    }
}, { timestamps: true });

// Auto-assign state number
officerSchema.pre("save", function () {
    if (this.state && (this.isNew || this.isModified("state"))) {
        const stateNumber = STATE_NUMBER_MAP[this.state];
        if (stateNumber) {
            this.stateNumber = stateNumber;
        }
    }
});

// Index for efficient queries
officerSchema.index({ addedBy: 1, role: 1 });
officerSchema.index({ role: 1, status: 1 });

export const Officer = mongoose.model("Officer", officerSchema);
