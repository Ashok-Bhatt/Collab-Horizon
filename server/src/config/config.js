import {config} from "dotenv"

const environment = "development";

config({path: `./.env.${environment}.local`});

export const {
    PORT,
    ENVIRONMENT,
    CORS_ORIGIN,
    MONGODB_URI,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY,
} = process.env