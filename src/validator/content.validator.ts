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
    body("jenis").isIn(["berita", "pengurus", "imsakiyah", "sejarah"]).withMessage("Jenis konten tidak valid."),
    body("isTampil").optional().isBoolean().withMessage("Tampil harus berupa boolean."),
    validateRequest
];

export const updateContentValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    body("judul").optional().notEmpty().withMessage("Judul tidak boleh kosong bila diupdate."),
    body("jenis").optional().isIn(["berita", "pengurus", "imsakiyah", "sejarah"]).withMessage("Jenis konten tidak valid."),
    body("isTampil").optional().isBoolean().withMessage("Tampil harus berupa boolean."),
    validateRequest
];

export const idValidator = [
    param("id").isInt().withMessage("ID harus berupa angka."),
    validateRequest
];
