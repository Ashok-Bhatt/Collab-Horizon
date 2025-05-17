import {Router} from "express";

import {
    loginUser,
    createAccount
} from "../controllers/user.controllers.js";

import {upload} from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/createAccount").post(createAccount);

export default router;