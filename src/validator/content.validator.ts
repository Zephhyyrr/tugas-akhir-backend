import { body, param, validationResult } from "express-validator";
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

export const createContentValidator = [
    body("judul").notEmpty().withMessage("Judul wajib diisi."),
    body("isi").notEmpty().withMessage("Isi wajib diisi."),
    body("status").notEmpty().withMessage("Status wajib diisi."),
    body("userId").isInt().withMessage("userId harus berupa angka."),
    body("gambarUrl").optional().isString().withMessage("gambarUrl harus berupa string."),
    body("videoUrl").optional().isString().withMessage("videoUrl harus berupa string."),
    validateRequest
];

export const updateContentValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("judul").notEmpty().withMessage("Judul wajib diisi."),
    body("isi").notEmpty().withMessage("Isi wajib diisi."),
    body("status").notEmpty().withMessage("Status wajib diisi."),
    body("gambarUrl").optional().isString().withMessage("gambarUrl harus berupa string."),
    body("videoUrl").optional().isString().withMessage("videoUrl harus berupa string."),
    validateRequest
];

export const idValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    validateRequest
];
