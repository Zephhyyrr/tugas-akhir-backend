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

export const createKeteranganTransaksiValidator = [
    body("nama").notEmpty().withMessage("Nama wajib diisi."),
    validateRequest
];

export const updateKeteranganTransaksiValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("nama").notEmpty().withMessage("Nama wajib diisi."),
    validateRequest
];

export const idValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    validateRequest
];
