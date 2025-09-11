import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import {CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME} from "../config/config.js"

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    
    try{
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(
            localFilePath, 
            {
                folder: "Collab Horizon"
            }
        )

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }

}

const removeFromCloudinary = async (publicId) => {
    try{
        if (!publicId) return null;
        const response = await cloudinary.uploader.destroy("Collab Horizon/" + publicId);
        return response;
    } catch (error){
        return null;
    }

}

export {uploadOnCloudinary, removeFromCloudinary};