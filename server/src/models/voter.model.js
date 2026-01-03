import mongoose from "mongoose";

const voterSchema = new mongoose.Schema({
    epidId : {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
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
        required: true
    }

}, { timestamps: true });

export const VoterModel = mongoose.model('Voter', voterSchema);