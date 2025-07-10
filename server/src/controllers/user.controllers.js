import {User} from "../models/user.model.js";
import {Project} from "../models/project.model.js";
import {uploadOnCloudinary, removeFromCloudinary} from  "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
        email
    });

    if (!user){
        throw Error("User with given email not present!");
    }


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

    // Extract user from the user_id and remove password and refreshToken from user
    const userWithProjects = await User.aggregate([

        // First Pipeline : Matching the user through id
        {
            $match : {
                _id : new mongoose.Types.ObjectId(user._id),
            }
        }, 

        // Second Pipeline
        {
            $lookup : {
                from : "projects",                  // Collection name
                let : {userId : "$_id"},
                pipeline : [
                    {
                        $match : {
                            $expr: {
                                $gt : [
                                    {
                                        $size : {
                                            $filter : {
                                                input : "$projectGroup",        // Field name which will be visited/traversed
                                                as : "group",                   // Each Element of project group : {groupMember, designation}
                                                cond : {
                                                    $eq : ["$$group.groupMember", "$$userId"]
                                                }
                                            }
                                        }
                                    }, 
                                    0
                                ]
                            }
                        }
                    }
                ],
                as : "projects",
            }
        },

        // Last Pipeline : Exclude password and refreshToken
        {
            $project : {
                password : 0,
                __v : 0,
            }
        }
    ])

    // console.log(userWithProjects);

    // Send access token and refresh token to user via cookie

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
    }

    return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(200)
    .json({
        user: userWithProjects,
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

    // console.log(req.files)

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


const logout = async (req, res) => {

    /*  
    Steps for logout:

    # Get user info from the req.user
    # Remove refresh Token from the the database
    # Remove access token and refresh token from cookies
    */


    // Get user info from req.user

    const loggedInUser = req.user;


    // Remove refresh token from the database
    await User.findByIdAndUpdate(
        loggedInUser._id,
        {
            $unset : {
                refreshToken: 1,    // 1 inside $unset means exclude it
            }
        },
        {
            new: true,              // new = true means changes gets saved
        },
    )

    const options = {
        httpOnly: true,
        secure: false,
    }

    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        {
            status: "success",
            message: "Logged Out Successfully!"
        }
    )
}


const updateAvatar = async (req, res) => {

    /* 
    Steps to update avatar image:
    # Get user from req.user
    # get new profile image from req.body
    # store cloudinary url of previous image into a variable
    # Store new image to cloudinary
    # Update the link in database
    # Now delete the previous image using the url stored in the variable used above
    # Send response back to the user
    */


    // Get user from the req.user
    const loggedInUser = req.user;

    
    // Get new profile photo from req.body
    let profilePhoto;

    if (req.files){
        if (Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
            profilePhoto = req.files.avatar[0].path;
        } else {
            profilePhoto = req.files.avatar.path;
        }
    } else {
        throw Error("Image not provided properly");
    }

    // console.log(loggedInUser);


    // Storing url of previous image into a variable so that once new image is assigned, it can get deleted
    const previousProfileImage = loggedInUser.avatar
    const previousImagePublicId = previousProfileImage.split('/').at(-1).split(".")[0];

    // console.log(previousProfileImage);


    // Store new image to cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(profilePhoto);

    if (!cloudinaryResponse){
        throw Error("Couldn't upload new profile!")
    }


    // update link in database 
    const user = await User.findByIdAndUpdate(
        loggedInUser._id, 
        {
            $set : {
                avatar : cloudinaryResponse.url,
            } 
        },
        {
            new : true,
        },
    )

    console.log(user.avatar);
    console.log(cloudinaryResponse.url);

    // console.log(cloudinaryResponse.url);
    // console.log(await User.findById(loggedInUser._id).select("avatar"));


    // Delete Previous image

    // console.log("Previous Public Id: ", previousImagePublicId);
    const cloudinaryRemoveResponse = await removeFromCloudinary(previousImagePublicId);

    if (!cloudinaryRemoveResponse){
        throw Error("Couldn't delete previous profile photo from storage");
    }


    // Send a response to the User
    res.status(200).json({
        status: 200,
        message : "Image Updated Successfully",
        image: cloudinaryResponse.url,
    })

}


const updateProfile = async (req, res) => {

    /* 
    Steps to update profile info: 

    # Take input via request
    # Validate Input
    # Get user from req.users
    # Update User Info in the database
    # Send response to the user 
    */


    // Take input from request
    const {username, bio, skills, socialProfilesLinks} = req.body;


    // Validate input
    if (!username.trim() || bio==null || skills==null || socialProfilesLinks==null){
        throw Error("Every Field is required");
    }


    // Get user from req.users
    const loggedInUser = req.user;


    // Update user info in the database
    const updateResponse = await User.findByIdAndUpdate(
        loggedInUser._id, 
        {
            $set : {
                username,
                bio,
                skills,
                socialProfilesLinks,
            }
        },
        {
            new: true,
        }
    )

    if (!updateResponse){
        throw Error("Couldn't update new information");
    }

    // Now send response to user
    res.status(200).json({
        status: 200,
        message : "Data Updated Successfully",
    })

}


const updateCoverImage = async (req, res) => {

    /* 
    Steps to update the cover image:
    # Take user from req.user
    # Take coverImage from req body
    # If coverImage for user exists, then store it in a variable
    # Upload a new image on cloudinary
    # Update coverImage on database
    # Delete previous image from cloudinary (if existed)
    # Return response to the user
    */


    // Take user from the req.user
    const loggedInUser = req.user;


    // Take cover image from request body (req.files)
    let coverImage;
    if (req.files && req.files.coverImage){
        if (Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
            coverImage = req.files.coverImage[0].path;
        } else {
            coverImage = req.files.coverImage.path;
        }
    }

    if (!coverImage){
        throw Error("Kindly provide cover image.");
    }


    // Storing url previous cover image in a variable
    const previousCoverImageUrl = loggedInUser.coverImage;
    const previousCoverImagePublicId = previousCoverImageUrl?.split("/").at(-1).split(".")[0];


    // Add new cover image to cloudinary
    const addImageResponse = await uploadOnCloudinary(coverImage);

    if (!addImageResponse){
        throw Error("Couldn't upload new cover image");
    }


    // Update cover image link in database
    await User.findByIdAndUpdate(
        loggedInUser._id, 
        {
            $set : {
                coverImage: addImageResponse.url,
            }
        },
        {
            new: true,
        },
    )

    // Delete previous cover image from cloudinary if existed
    if (previousCoverImageUrl){
        const deleteResponse = await removeFromCloudinary(previousCoverImagePublicId);

        if (!deleteResponse){
            throw Error("Couldn't delete the previous cover image from cloudinary");
        }
    }

    // Now send response to user
    res.status(200).json({
        status: 200,
        message : "Image Updated Successfully",
        image: addImageResponse.url,
    })

} 


const getUserInfo = async (req, res) => {

    /*
    Steps to get current logged in user's information
    # Get user_id from the route parameter
    # Extract user from that user_id and Remove password and refreshToken from user
    # Send response back to the user
    */
    
    // get user from the req.user
    const userId = req.params.userId;

    if (!userId){
        throw Error("Please provide user id.");
    }

    // console.log(req.user._id);
    // console.log(userId);

    // NOTE: Even though userId contains only a string and not id string wrapped inside ObjectId instance, it can still be used to find user instance in findById function, but when using aggregation pipelines, it won't work.

    // Extract user from the user_id and remove password and refreshToken from user
    const user = await User.aggregate([

        // First Pipeline : Matching the user through id
        {
            $match : {
                _id : new mongoose.Types.ObjectId(userId),
            }
        }, 

        // Second Pipeline
        {
            $lookup : {
                from : "projects",                  // Collection name
                let : {userId : "$_id"},
                pipeline : [
                    {
                        $match : {
                            $expr: {
                                $gt : [
                                    {
                                        $size : {
                                            $filter : {
                                                input : "$projectGroup",        // Field name which will be visited/traversed
                                                as : "group",                   // Each Element of project group : {groupMember, designation}
                                                cond : {
                                                    $eq : ["$$group.groupMember", "$$userId"]
                                                }
                                            }
                                        }
                                    }, 
                                    0
                                ]
                            }
                        }
                    }
                ],
                as : "projects",
            }
        },

        // Last Pipeline : Exclude password and refreshToken
        {
            $project : {
                refreshToken : 0,
                password : 0,
                __v : 0,
            }
        }
    ])

    if (!user){
        throw Error("User with given id not found");
    }

    // console.log(user);

    // Send response back to the user
    return res.status(200).json(user);

}


const changePassword = async (req, res) => {

    /* 
    Steps to change password:
    # Get user from req.users
    # Get old and new password from request body
    # validate both passwords
    # Check if old password is correct or not
    # change password in database
    # Send response to user
    */


    // Get user from req.users
    const loggedInUser = req.user;
    const user = await User.findById(loggedInUser._id);


    // Get new and old password from req body
    const {oldPassword, newPassword} = req.body;


    // validate both passwords
    if (!oldPassword.trim() || !newPassword.trim()){
        throw Error("Old and new password are required");
    } else if (newPassword.trim().length < 8){
        throw Error("Password length should be at least 8");
    }


    // Check if old password is correct or not
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect){
        throw Error("Incorrect password!");
    }


    // Save new password to database
    user.password = newPassword;
    await user.save({validateBeforeSave: false})


    // Return response to the user
    return res.status(200).json({
        status: 200,
        message: "password saved successfully",
    })

}


const getNewTokens = async (req, res) => {

    /* 
    Steps to get new access token and new refresh token
    # Get previous refresh token from req.cookie or req.body
    # Get user from decoded refresh token by verifying incoming refresh token
    # Check if incoming refresh token and the token saved in user database are same or not
    # Generate new access and refresh token
    # Save new refresh token in database
    # save this refresh and access token in cookie
    # return response to the user
    */

    // console.log(req.cookies);

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken){
        throw Error("Refresh token required!");
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);

    if (!user){
        throw Error("Invalid refresh token");
    }


    // Checking if incoming refresh token and refresh token stored in database are same or not
    if (incomingRefreshToken != user.refreshToken){
        throw Error("Refresh token is either expired or used.");
    }


    // Generating new access and refresh token
    const options = {
        httpOnly: true,
        secure: true,
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    
    // Storing new refresh token in database
    user.refreshToken = refreshToken;
    user.save({validateBeforeSave: false});


    // Sending response back to the user and also storing new tokens in the cookie
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        status: 200,
        refreshToken,
        accessToken,
        message: "New refresh token and access token received!",
    })

}

const getNewAccessToken = async (req, res) => {

    /* 
    Steps to get new access token
    # Generate new access token
    # Storing it in cookies and returning response
    */


    // Generate new access token
    const accessToken = await User.generateAccessToken();


    // Storing new access token to cookie and returning the response

    const options = {
        httpOnly: true,
        secure: false,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json({
        status: 200,
        accessToken,
        message: "New Access token generated!",
    })

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
    getNewAccessToken,
};