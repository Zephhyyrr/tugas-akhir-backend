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
    body("kredit").optional({ values: "falsy" }).isFloat().withMessage("Kredit harus berupa angka."),
    body("debet").optional({ values: "falsy" }).isFloat().withMessage("Debet harus berupa angka."),
    body("uraian").notEmpty().withMessage("Uraian wajib diisi."),
    body("tanggal").isISO8601().withMessage("Tanggal harus format ISO8601."),
    body("keteranganTransaksiId").isInt().withMessage("keteranganTransaksiId harus berupa angka."),
    body().custom((_, { req }) => {
        const kredit = req.body.kredit;
        const debet = req.body.debet;

        if ((kredit === undefined || kredit === "") && (debet === undefined || debet === "")) {
            throw new Error("Kredit atau debet wajib diisi.");
        }

        return true;
    }),
    validateRequest
];

export const updateTransactionValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("kredit").optional({ values: "falsy" }).isFloat().withMessage("Kredit harus berupa angka."),
    body("debet").optional({ values: "falsy" }).isFloat().withMessage("Debet harus berupa angka."),
    body("uraian").notEmpty().withMessage("Uraian wajib diisi."),
    body("tanggal").isISO8601().withMessage("Tanggal harus format ISO8601."),
    body("keteranganTransaksiId").optional().isInt().withMessage("keteranganTransaksiId harus berupa angka."),
    body().custom((_, { req }) => {
        const kredit = req.body.kredit;
        const debet = req.body.debet;

        if ((kredit === undefined || kredit === "") && (debet === undefined || debet === "")) {
            throw new Error("Kredit atau debet wajib diisi.");
        }

        return true;
    }),
    validateRequest
];

export const idValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    validateRequest
];
