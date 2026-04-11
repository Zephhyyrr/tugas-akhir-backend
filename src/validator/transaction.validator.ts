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

export const createTransactionValidator = [
    body("saldo").isFloat().withMessage("Saldo harus berupa angka."),
    body("kredit").isFloat().withMessage("Kredit harus berupa angka."),
    body("debet").isFloat().withMessage("Debet harus berupa angka."),
    body("uraian").notEmpty().withMessage("Uraian wajib diisi."),
    body("tanggal").isISO8601().withMessage("Tanggal harus format ISO8601."),
    body("userId").isInt().withMessage("userId harus berupa angka."),
    body("keteranganTransaksiId").isInt().withMessage("keteranganTransaksiId harus berupa angka."),
    validateRequest
];

export const updateTransactionValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("saldo").isFloat().withMessage("Saldo harus berupa angka."),
    body("kredit").isFloat().withMessage("Kredit harus berupa angka."),
    body("debet").isFloat().withMessage("Debet harus berupa angka."),
    body("uraian").notEmpty().withMessage("Uraian wajib diisi."),
    body("tanggal").isISO8601().withMessage("Tanggal harus format ISO8601."),
    validateRequest
];

export const idValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    validateRequest
];
