import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/api_errors";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new AppError("Validasi gagal", 400, errors.array());
    }
    next();
};

export const getPredictionValidator = [
    body("start_date")
        .notEmpty().withMessage("start_date wajib diisi.")
        .isISO8601().withMessage("start_date harus format ISO8601 (YYYY-MM-DD)."),
    body("end_date")
        .notEmpty().withMessage("end_date wajib diisi.")
        .isISO8601().withMessage("end_date harus format ISO8601 (YYYY-MM-DD)."),
    validateRequest
];
