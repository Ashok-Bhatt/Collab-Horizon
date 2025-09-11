import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ACCESS_TOKEN_SECRET} from "../config/config.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json(new ApiResponse(401, null, "Access token not provided"));

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) return res.status(404).json(new ApiResponse(404, null, "Invalid Access Token"));

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware: ", error);
        return res.status(500).json(new ApiResponse(500, null, "Something went wrong!"));
    }
};

export { verifyJWT };
