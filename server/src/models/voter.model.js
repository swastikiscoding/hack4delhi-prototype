import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const voterSchema = new mongoose.Schema({
    epicId : {
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
        required: [true, "Password is required"]
    },
    refreshToken: {
        type: String
    }

}, { timestamps: true });

voterSchema.pre("save", async function () {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

voterSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

voterSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            epicId: this.epicId,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

voterSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Voter = mongoose.model('Voter', voterSchema);