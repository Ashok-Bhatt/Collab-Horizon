import {User} from "../models/user.model.js";
import {uploadOnCloudinary, removeFromCloudinary} from  "../utils/cloudinary.js";
import {getUserWithProjects} from "../utils/aggregationPipeline.js"
import jwt from "jsonwebtoken";
import {REFRESH_TOKEN_SECRET} from "../config/config.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email?.trim() || !password?.trim()) return res.status(400).json(new ApiResponse(400, null, "Email and password are both required"));

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json(new ApiResponse(404, null, "User with given email not present!"));

        const isPasswordMatched = await user.isPasswordCorrect(password);
        if (!isPasswordMatched) return res.status(401).json(new ApiResponse(401, null, "Password not matched!"));

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({validateBeforeSave : false});

        const userWithProjects = await getUserWithProjects(user.id, {
            password : 0,
            __v : 0,
        });

        const options = { httpOnly: true, secure: false, sameSite: 'Lax' };

        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .json(new ApiResponse(200, { user: userWithProjects, accessToken, refreshToken }, "User logged in successfully"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const createAccount = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        if (!username?.trim() || !email?.trim() || !password?.trim()) return res.status(400).json(new ApiResponse(400, null, "All fields are mandatory."));
        if (password.length < 8) return res.status(400).json(new ApiResponse(400, null, "Password length should at least 8"));

        let avatarLocalPath;
        if (req.files){
            if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
                avatarLocalPath = req.files.avatar[0]?.path;
            } else {
                avatarLocalPath = req.files.avatar.path;
            }
        }
        if (!avatarLocalPath) return res.status(400).json(new ApiResponse(400, null, "Avatar File is required"));

        const existedUser = await User.findOne({ email });
        if (existedUser) return res.status(409).json(new ApiResponse(409, null, "User with given email already exists. Enter another email"));

        const cloudinaryResponse = await uploadOnCloudinary(avatarLocalPath);
        if (!cloudinaryResponse) return res.status(500).json(new ApiResponse(500, null, "Unable to upload image!"));

        const user = await User.create({ username, email, password, avatar : cloudinaryResponse.url });
        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) return res.status(500).json(new ApiResponse(500, null, "Something went wrong while creating user"));

        return res.status(200).json(new ApiResponse(200, createdUser, "User Created Successfully"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const logout = async (req, res) => {
    try {
        const loggedInUser = req.user;

        await User.findByIdAndUpdate(
            loggedInUser._id,
            { $unset : { refreshToken: 1 } },
            { new: true },
        )

        const options = { httpOnly: true, secure: false };

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, null, "Logged Out Successfully!"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const updateAvatar = async (req, res) => {
    try {
        const loggedInUser = req.user;

        let profilePhoto;
        if (req.files){
            if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
                profilePhoto = req.files.avatar[0].path;
            } else {
                profilePhoto = req.files.avatar.path;
            }
        } else {
            return res.status(400).json(new ApiResponse(400, null, "Image not provided properly"));
        }

        const previousProfileImage = loggedInUser.avatar
        const previousImagePublicId = previousProfileImage.split('/').at(-1).split(".")[0];

        const cloudinaryResponse = await uploadOnCloudinary(profilePhoto);
        if (!cloudinaryResponse) return res.status(500).json(new ApiResponse(500, null, "Couldn't upload new profile!"));

        await User.findByIdAndUpdate(
            loggedInUser._id, 
            { $set : { avatar : cloudinaryResponse.url } },
            { new : true },
        )

        if (cloudinaryResponse){
            const cloudinaryRemoveResponse = await removeFromCloudinary(previousImagePublicId);
            if (!cloudinaryRemoveResponse) return res.status(500).json(new ApiResponse(500, null, "Couldn't delete previous profile photo from storage"));
        }

        return res.status(200).json(new ApiResponse(200, { image: cloudinaryResponse.url }, "Image Updated Successfully"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const updateProfile = async (req, res) => {
    try {
        const {username, bio, skills, socialProfilesLinks} = req.body;

        if (!username?.trim() || bio==null || skills==null || socialProfilesLinks==null) return res.status(400).json(new ApiResponse(400, null, "Every Field is required"));

        const loggedInUser = req.user;

        const updateResponse = await User.findByIdAndUpdate(
            loggedInUser._id, 
            { $set : { username, bio, skills, socialProfilesLinks } },
            { new: true }
        )

        if (!updateResponse) return res.status(500).json(new ApiResponse(500, null, "Couldn't update new information"));

        return res.status(200).json(new ApiResponse(200, updateResponse, "Data Updated Successfully"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const updateCoverImage = async (req, res) => {
    try {
        const loggedInUser = req.user;

        let coverImage;
        if (req.files && req.files.coverImage){
            if (Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
                coverImage = req.files.coverImage[0].path;
            } else {
                coverImage = req.files.coverImage.path;
            }
        }
        if (!coverImage) return res.status(400).json(new ApiResponse(400, null, "Kindly provide cover image."));

        const previousCoverImageUrl = loggedInUser.coverImage;
        const previousCoverImagePublicId = previousCoverImageUrl?.split("/").at(-1).split(".")[0];

        const addImageResponse = await uploadOnCloudinary(coverImage);
        if (!addImageResponse) return res.status(500).json(new ApiResponse(500, null, "Couldn't upload new cover image"));

        await User.findByIdAndUpdate(
            loggedInUser._id, 
            { $set : { coverImage: addImageResponse.url } },
            { new: true },
        )

        if (previousCoverImageUrl){
            const deleteResponse = await removeFromCloudinary(previousCoverImagePublicId);
            if (!deleteResponse) return res.status(500).json(new ApiResponse(500, null, "Couldn't delete the previous cover image from cloudinary"));
        }

        return res.status(200).json(new ApiResponse(200, { image: addImageResponse.url }, "Image Updated Successfully"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
} 

const getUserInfo = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) return res.status(400).json(new ApiResponse(400, null, "Please provide user id."));

        const user = await getUserWithProjects(userId, {
            password : 0,
            refreshToken: 0,
            __v : 0,
        });

        if (!user) return res.status(404).json(new ApiResponse(404, null, "User with given id not found"));

        return res.status(200).json(new ApiResponse(200, user, "User info fetched successfully"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const changePassword = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser._id);

        const {oldPassword, newPassword} = req.body;

        if (!oldPassword?.trim() || !newPassword?.trim()) return res.status(400).json(new ApiResponse(400, null, "Old and new password are required"));
        else if (newPassword.trim().length < 8) return res.status(400).json(new ApiResponse(400, null, "Password length should be at least 8"));

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) return res.status(401).json(new ApiResponse(401, null, "Incorrect password!"));

        user.password = newPassword;
        await user.save({validateBeforeSave: false})

        return res.status(200).json(new ApiResponse(200, null, "password saved successfully"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const getNewTokens = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) return res.status(400).json(new ApiResponse(400, null, "Refresh token required!"));

        const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id);

        if (!user) return res.status(401).json(new ApiResponse(401, null, "Invalid refresh token"));

        if (incomingRefreshToken != user.refreshToken) return res.status(403).json(new ApiResponse(403, null, "Refresh token is either expired or used."));

        const options = { httpOnly: true, secure: true };

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        user.save({validateBeforeSave: false});

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { refreshToken, accessToken }, "New refresh token and access token received!"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

const checkAuth = async (req, res) => {
    try {
        const loggedInUser = req.user;
        if (!loggedInUser) return res.status(401).json(new ApiResponse(401, null, "Unauthorized!"));

        const userWithProjects = await getUserWithProjects(loggedInUser._id, {
            password: 0,
            refreshToken: 0,
            __v: 0,
        });

        return res.status(200).json(new ApiResponse(200, userWithProjects, "User is authenticated"));
    } catch (error) {
        console.log("Error in user controller", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
}

export {
    loginUser,
    createAccount,
    logout,
    updateProfile,
    updateAvatar,
    updateCoverImage,
    getUserInfo,
    changePassword,
    getNewTokens,
    checkAuth,
};
