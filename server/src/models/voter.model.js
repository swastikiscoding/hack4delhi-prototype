import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pkg from "js-sha3";
import { STATE_NUMBER_MAP } from "./statemap.js";

const { keccak256 } = pkg;

const voterSchema = new mongoose.Schema({
    epicId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    constituency_number: {
        type: String,
        required: true
    },
    constituency_name: {
        type: String,
        required: true
    },
    part_number: {
        type: String,
        required: true
    },
    part_name: {
        type: String,
        required: true
    },
    polling_station: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    qr_code: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    },
    hash: {
        type: String
    },
    state: {
        type: String,
        required: true,
        enum: Object.keys(STATE_NUMBER_MAP),
        trim: true
    },
    state_number: {
        type: Number,
        // immutable: true
    }
}, { timestamps: true });

/* =========================
   PRE-SAVE HOOK
========================= */
voterSchema.pre("save", async function () {
    // NOTE: Mongoose supports promise-based middleware. Using `async` + `next`
    // can lead to `next is not a function` depending on how middleware is invoked.

    // Deterministic identity hash
    this.hash = keccak256(this.epicId + this.name);

    // Auto-assign state number
    if (this.isNew || this.isModified("state")) {
        const stateNumber = STATE_NUMBER_MAP[this.state];

        if (!stateNumber) {
            throw new Error(`Invalid state/UT: ${this.state}`);
        }

        this.state_number = stateNumber;
    }

    // Hash password only if changed
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

/* =========================
   METHODS
========================= */
voterSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
};

voterSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            epicId: this.epicId,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

voterSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

/* =========================
   INDEXES (optional but good)
========================= */
voterSchema.index({ epicId: 1 });
voterSchema.index({ state_number: 1 });

export const Voter = mongoose.model("Voter", voterSchema);
