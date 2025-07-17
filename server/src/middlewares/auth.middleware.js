import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ACCESS_TOKEN_SECRET} from "../config/config.js"

const verifyJWT = async (req, res, next) => {

    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token){
            throw new ApiError(statusCode = 401, message="Access token not provided User");
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user){
            throw new ApiError(statusCode = 401, message="Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error){
        throw new ApiError(statusCode=401, message="Valid Access Token Required!");
    }
}

export {verifyJWT};