import { DB_NAME } from "../constants.js";
import mongoose from "mongoose";
import {MONGODB_URI} from "../config/config.js"

const connectToDB = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB Database Connected! Database Host ${connectionInstance.connection.host}`);
    } catch (error){
        console.log("MongoDB Database Connection Error: ", error);
        process.exit(1);
    }
}

export default connectToDB;