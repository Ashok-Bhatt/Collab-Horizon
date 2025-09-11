import {Router} from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";

import {
    loginUser,
    createAccount,
    logout,
    updateProfile,
    updateAvatar,
    updateCoverImage,
    getUserInfo,
    getNewTokens,
    changePassword,
    checkAuth
} from "../controllers/user.controllers.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/createAccount").post(createAccount);


// Secured Routes
router.route("/logout").post(verifyJWT, logout);
router.route("/updateProfile").patch(verifyJWT, updateProfile);
router.route("/updateAvatar").patch(verifyJWT, updateAvatar);
router.route("/updateCoverImage").patch(verifyJWT, updateCoverImage);
router.route("/getUserInfo/:userId").get(verifyJWT, getUserInfo);
router.route("/changePassword").post(verifyJWT, changePassword);
router.route("/getNewTokens").post(verifyJWT, getNewTokens);
router.route("/checkAuth").get(verifyJWT, checkAuth);

export default router;