import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkProjectVisibility } from "../middlewares/projectVisibility.middleware.js";
import { checkUserAuthorization } from "../middlewares/authorization.middleware.js"; 

import {
    getTodoInfo,
    addTodo,
    removeTodo,
    updateTodo,
    getTodos,
    changeProgressStatus,
    changeTodoPriority,
} from "../controllers/mainTodo.controllers.js";

const router = Router();

router.route("/getTodoInfo").get(
    verifyJWT,
    checkUserAuthorization,
    checkProjectVisibility,
    getTodoInfo
)

router.route("/addTodo").post(
    verifyJWT,
    checkUserAuthorization,
    addTodo,
)

router.route("/removeTodo").delete(
    verifyJWT,
    checkUserAuthorization,
    removeTodo,
)

router.route("/updateTodo").patch(
    verifyJWT,
    checkUserAuthorization,
    updateTodo,
)

router.route("/getTodos").get(
    verifyJWT,
    checkUserAuthorization,
    checkProjectVisibility,
    getTodos,
)

router.route("/changeTodoPriority").patch(
    verifyJWT,
    checkUserAuthorization,
    changeTodoPriority,
)

export default router;