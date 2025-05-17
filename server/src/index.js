import {app} from "./app.js"
import connectToDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

/* CommonJS Way to connect dotenv module
require("dotenv").config({
    path : './.env'
}); */

connectToDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Listening to app on PORT no ${process.env.PORT || 3000}`);
    })
})
.catch((error)=>{
    console.log("MongoDB Database Failed to connect! ", error);
})