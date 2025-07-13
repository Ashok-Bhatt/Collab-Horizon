import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {

    try{
        console.log(req.header("Authorization"))
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token){
            throw Error("Unauthorized User");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user){
            throw Error("Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error){
        throw new Error("Something went wrong: ", error.message);
    }
}

export {verifyJWT};