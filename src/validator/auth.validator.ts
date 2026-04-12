import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

export const loginValidator = [
    body("email").isEmail().withMessage("Format email tidak valid."),
    body("password").notEmpty().withMessage("Password wajib diisi."),
    validateRequest
];

export const forgotPasswordValidator = [
    body("email").isEmail().withMessage("Format email tidak valid."),
    validateRequest
];

export const resetPasswordValidator = [
    body("newPassword").isLength({ min: 6 }).withMessage("Password minimal 6 karakter."),
    validateRequest
];
