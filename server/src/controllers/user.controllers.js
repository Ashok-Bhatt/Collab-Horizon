import mongoose from "mongoose";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from  "../utils/cloudinary.js";

const loginUser = async (req, res) => {
    
    /* 
    Steps for login process:

    # Get email and password as input
    # Validate input
    # Match given email in the database
    # Check if password is correct or not
    # Create Access and Refresh Token
    # Store Refresh Token in database
    # Send Access and refresh token to the user via cookie

    */


    // Taking email and password as input from request
    const {email, password} = req.body;


    // Validate email ans password
    if (!email.trim() || !password.trim()){
        throw Error("Email and password are both required");
    }


    // Finding user in database
    const user = await User.findOne({
        email,
    });

    if (!user){
        throw Error("User with given email not present!");
    }

    console.log(user);
    
    // Checking if user has entered correct password or not
    const isPasswordMatched = await user.isPasswordCorrect(password);

    if (!isPasswordMatched){
        throw Error("Password not matched!");
    }

    // Generating access token and refresh token
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    // Store refresh token in database
    user.refreshToken = refreshToken;
    user.save({validateBeforeSave : false});

    // console.log(user);

    // Send access token and refresh token to user via cookie

    // Note : We used Schema object, User rather than user object that was holding a user, so be aware of that
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        user,
        accessToken,
        refreshToken,
        message: "User logged in successfully",
    })

}

const createAccount = async (req, res) => {

    /* 
    Steps for create account/signup process:

    # Get inputs from form or postman
    # Validate and handle input data
    # Check if given gmail already exists or not
    # Check for avatar image
    # Upload avatar image on cloudinary
    # Create a new user and store userInfo in database
    # return response 

    */


    // taking input from the request

    // Logs json data that was provided in body of request
    // console.log(req.body);


    const {username, email, password} = req.body;


    // validate input data
    if (!username.trim() || !email.trim() || !password.trim()){
        throw Error("All fields are mandatory.");
    }

    if (password.length < 8){
        throw Error("Password length should at least 8");
    }


    // Validate for avatar image

    console.log(req.files)

    let avatarLocalPath;
    if (req.files){
        if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
            avatarLocalPath = req.files.avatar[0]?.path;
        } else {
            avatarLocalPath = req.files.avatar.path;
        }
    }

    if (!avatarLocalPath){
        throw Error("Avatar File is required");
    }

    // console.log(avatarLocalPath);


    // Checking if given email already exists in mongodb or not
    const existedUser = await User.findOne({
        email,
    })

    if (existedUser){
        throw Error("User with given email already exists. Enter another email");
    }


    // Uploading avatar image on cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(avatarLocalPath);

    if (!cloudinaryResponse){
        throw Error("Unable to upload image!");
    }

    // create a  new user and store userInfo on Database
    const user = await User.create({
        username,
        email,
        password,
        avatar : cloudinaryResponse.url,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser){
        throw Error("Something went wrong while creating user");
    }


    // Return response
    return res.status(200).json({
        status : 200,
        user : createdUser,
        message : "User Created Successfully"
    })

}

export {loginUser, createAccount};