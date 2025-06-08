import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import formData from "express-form-data";

const app = express()

app.use(express.json({limit: "16mb"}))
app.use(express.urlencoded({extended: true, limit: "16mb"}))
app.use(formData.parse())
app.use(express.static("public"))
app.use(cookieParser())

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

// Importing Routes
import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import mainTodoRouter from "./routes/mainTodo.routes.js";
import subTodoRouter from "./routes/subTodo.routes.js";

// Note: '/' before /api/v1/user is very important else it won't work as expects a request like this - 'https:localhost:3000/api/v1/user/..'
app.use("/api/v1/user", userRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/mainTodo", mainTodoRouter);
app.use("/api/v1/subTodo", subTodoRouter);

export {app}