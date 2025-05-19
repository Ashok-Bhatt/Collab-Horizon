import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createProject,
} from "../controllers/project.controllers.js";


const router = Router();


// Secure Routes
router.route("/createProject").post(verifyJWT, createProject);

export default router;