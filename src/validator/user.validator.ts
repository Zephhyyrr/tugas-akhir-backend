import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { RoleUser } from "@prisma/client";

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

export const createUserValidator = [
    body("email").isEmail().withMessage("Format email tidak valid."),
    body("nama").notEmpty().withMessage("Nama wajib diisi."),
    body("password").isLength({ min: 6 }).withMessage("Password minimal 6 karakter."),
    body("role").isIn(Object.values(RoleUser)).withMessage("Role tidak valid."),
    validateRequest
];

export const updateUserValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("email").isEmail().withMessage("Format email tidak valid."),
    body("nama").notEmpty().withMessage("Nama wajib diisi."),
    body("role").isIn(Object.values(RoleUser)).withMessage("Role tidak valid."),
    body("password").optional().isLength({ min: 6 }).withMessage("Password minimal 6 karakter."),
    validateRequest
];

export const idValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    validateRequest
];

export const updatePhotoValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    validateRequest
];