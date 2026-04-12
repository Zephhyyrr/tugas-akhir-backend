import { Router } from "express";
import {
    loginController,
    verifyEmailController,
    forgotPasswordController,
    resetPasswordController
} from "../controllers/auth.controller";
import {
    loginValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} from "../validator/auth.validator";

const router = Router();

router.post("/login", loginValidator, loginController);
router.get("/verify-email", verifyEmailController);
router.post("/forgot-password", forgotPasswordValidator, forgotPasswordController);
router.post("/reset-password", resetPasswordValidator, resetPasswordController);

export default router;
