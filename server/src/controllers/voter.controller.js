import { Voter } from "../models/voter.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await Voter.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export const registerVoter = asyncHandler(async (req, res) => {
    const { epicId, name, dob, gender, address, constituency_number, constituency_name,state, part_number, part_name, polling_station, photo, qr_code, password } = req.body;

    if (
        [epicId, name, dob, gender, address, constituency_number, constituency_name, state, part_number, part_name, polling_station, photo, qr_code, password].some((field) => {
            if (field === undefined || field === null) return true;
            if (typeof field === 'string' && field.trim() === "") return true;
            return false;
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedVoter = await Voter.findOne({ epicId });

    if (existedVoter) {
        throw new ApiError(409, "Voter with this EPID already exists")
    }

    const voter = await Voter.create({
        epicId,
        name,
        dob,
        gender,
        address,
        constituency_number,
        constituency_name,
        state,
        part_number,
        part_name,
        polling_station,
        photo,
        qr_code,
        password,
        state
    })

    const createdVoter = await Voter.findById(voter._id).select(
        "-password -refreshToken"
    )

    if (!createdVoter) {
        throw new ApiError(500, "Something went wrong while registering the voter")
    }

    return res.status(201).json(
        new ApiResponse(200, createdVoter, "Voter registered Successfully")
    )
})

export const loginVoter = asyncHandler(async (req, res) => {
    console.log("req.body:", req.body);
    const { epicId, password } = req.body;

    if (!epicId) {
        throw new ApiError(400, "EPID is required")
    }

    const voter = await Voter.findOne({ epicId });

    if (!voter) {
        throw new ApiError(404, "Voter does not exist")
    }

    const isPasswordValid = await voter.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(voter._id)

    const loggedInVoter = await Voter.findById(voter._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInVoter, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
});

export const logoutVoter = asyncHandler(async(req, res) => {
    await Voter.findByIdAndUpdate(
        req.voter._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export const getVoterProfile = asyncHandler(async(req, res) => {
    const voter = await Voter.findById(req.voter._id).select("-password -refreshToken")

    if(!voter){
        throw new ApiError(404, "Voter not found")
    }
    return res.status(200).json(new ApiResponse(200, voter, "Voter profile fetched successfully"));
})