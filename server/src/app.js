import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import formData from "express-form-data";

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)
app.use(express.json({limit: "16mb"}))
app.use(express.urlencoded({extended: true, limit: "16mb"}))
app.use(formData.parse())
app.use(express.static("public"))
app.use(cookieParser())

// Importing Routes
import userRouter from "./routes/user.routes.js";

// Note: '/' before /api/v1/user is very important else it won't work as expects a request like this - 'https:localhost:3000/api/v1/user/..'
app.use("/api/v1/user", userRouter);

export {app}