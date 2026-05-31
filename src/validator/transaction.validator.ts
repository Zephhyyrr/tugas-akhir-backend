import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

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
    body('uraian').notEmpty().withMessage('Uraian wajib diisi.'),
    body('tipe').isIn(['uang_masuk', 'uang_keluar', 'saldo_awal']).withMessage('Tipe transaksi tidak valid.'),
    body('nominal').isFloat().withMessage('Nominal harus berupa angka.'),
    body('debit').isFloat().withMessage('Debit harus berupa angka.'),
    body('kredit').isFloat().withMessage('Kredit harus berupa angka.'),
    body('tanggal').isISO8601().withMessage('Tanggal harus format ISO8601.'),
    body('jenisKasId').isInt().withMessage('jenisKasId harus berupa angka.'),
    body('mediaPembayaranId').isInt().withMessage('mediaPembayaranId harus berupa angka.'),
    validateRequest
];

export const updateTransactionValidator = [
    param('id').isInt().withMessage('ID harus berupa angka.'),
    body('uraian').notEmpty().withMessage('Uraian wajib diisi.'),
    body('tipe').isIn(['uang_masuk', 'uang_keluar', 'saldo_awal']).withMessage('Tipe transaksi tidak valid.'),
    body('nominal').isFloat().withMessage('Nominal harus berupa angka.'),
    body('debit').isFloat().withMessage('Debit harus berupa angka.'),
    body('kredit').isFloat().withMessage('Kredit harus berupa angka.'),
    body('tanggal').isISO8601().withMessage('Tanggal harus format ISO8601.'),
    body('jenisKasId').isInt().withMessage('jenisKasId harus berupa angka.'),
    body('mediaPembayaranId').isInt().withMessage('mediaPembayaranId harus berupa angka.'),
    validateRequest
];

export const idValidator = [
    param('id').isInt().withMessage('ID harus berupa angka.'),
    validateRequest
];
