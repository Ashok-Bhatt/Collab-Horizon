import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkProjectVisibility } from "../middlewares/projectVisibility.middleware.js";
import { checkUserAuthorization } from "../middlewares/authorization.middleware.js"; 

import {
    addSubTodo,
    removeSubTodo,
    updateSubTodo,
    getSubTodos,
    changeProgressStatus,
} from "../controllers/subTodo.controllers.js";

const router = Router();

router.route("/addSubTodo").post(
    verifyJWT,
    checkUserAuthorization,
    addSubTodo,
)

router.route("/removeSubTodo").delete(
    verifyJWT,
    checkUserAuthorization,
    removeSubTodo,
)

router.route("/updateSubTodo").patch(
    verifyJWT,
    checkUserAuthorization,
    updateSubTodo,
)

router.route("/getSubTodos").get(
    verifyJWT,
    checkUserAuthorization,
    checkProjectVisibility,
    getSubTodos,
)

router.route("/changeProgressStatus").patch(
    verifyJWT,
    checkUserAuthorization,
    changeProgressStatus,
)

export default router;