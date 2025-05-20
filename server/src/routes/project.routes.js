import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkProjectVisibility } from "../middlewares/projectVisibility.middleware.js";
import { checkUserAuthorization } from "../middlewares/authorization.middleware.js";

import {
    createProject,
    getProjectInfo,
    changeInfo,
    removeProject,
    toggleVisibilityStatus,
    sendProjectJoiningRequest,
    getAllProjectJoiningRequests,
    handleProjectJoiningRequest,
} from "../controllers/project.controllers.js";


const router = Router();


// Secure Routes
router.route("/createProject").post(
    verifyJWT,
    createProject
);

router.route("/getProjectInfo").get(
    verifyJWT,
    checkUserAuthorization,
    checkProjectVisibility,
    getProjectInfo
)

router.route("/changeProjectInfo").patch(
    verifyJWT,
    checkUserAuthorization,
    changeInfo
)

router.route("/removeProject").delete(
    verifyJWT,
    checkUserAuthorization,
    removeProject
)

router.route("/toggleVisibilityStatus").patch(
    verifyJWT,
    checkUserAuthorization,
    toggleVisibilityStatus
)

router.route("/sendProjectJoiningRequest").post(
    verifyJWT,
    sendProjectJoiningRequest
)

router.route("/getAllProjectJoiningRequest").get(
    verifyJWT,
    checkUserAuthorization,
    checkProjectVisibility,
    getAllProjectJoiningRequests
)

router.route("/handleProjectJoiningRequest").delete(
    verifyJWT,
    checkUserAuthorization,
    handleProjectJoiningRequest
)

export default router;