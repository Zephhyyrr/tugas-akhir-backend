import { Router } from "express";
import {
    loginController,
    logoutController,
    verifyEmailController,
    forgotPasswordController,
    resetPasswordController,
    meController
} from "../controllers/auth.controller";
import {
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} from "../validator/auth.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { loginLimiter, forgotPasswordLimiter, resetPasswordLimiter } from "../middlewares/rate_limiter";

const router = Router();

router.post("/login", loginLimiter, loginValidator, loginController);
router.post("/logout", logoutController);
router.get("/me", jwtCheckToken, meController);
router.get("/verify-email", verifyEmailController);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordValidator, forgotPasswordController);
router.post("/reset-password", resetPasswordLimiter, resetPasswordValidator, resetPasswordController);

export default router;
