import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllTransactionService,
    getTransactionByIdService,
    createTransactionService,
    updateTransactionService,
    deleteTransactionService,
    deletePermanentTransactionService,
    getDraftTransactionService,
    getDashboardSummaryService
} from "../services/transaction.service";
import { AppError } from "../errors/api_errors";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllTransactionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        
        const filters = {
            search: req.query.search,
            type: req.query.type,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            month: req.query.month,
            year: req.query.year,
            jenisKasId: req.query.jenisKasId,
        };

        const transactions = await getAllTransactionService(page, limit, filters);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data transaction.",
            data: transactions.data,
            meta: transactions.meta,
            summary: transactions.summary
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getTransactionByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const transaction = await getTransactionByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail transaction.",
            data: transaction
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createTransactionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { uraian, tipe, nominal, debit, kredit, tanggal, jenisKasId, mediaPembayaranId } = req.body;
        const userId = Number((req as any).user?.id);

        if (!Number.isInteger(userId)) {
            throw new AppError("User tidak valid.");
        }

        const newTransaction = await createTransactionService(
            uraian,
            tipe,
            Number(nominal),
            Number(debit),
            Number(kredit),
            new Date(tanggal),
            userId,
            Number(jenisKasId),
            Number(mediaPembayaranId)
        );

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan transaction.`,
            data: newTransaction
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateTransactionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { uraian, tipe, nominal, debit, kredit, tanggal, jenisKasId, mediaPembayaranId } = req.body;
        const updatedTransaction = await updateTransactionService(
            Number(id),
            uraian,
            tipe,
            Number(nominal),
            Number(debit),
            Number(kredit),
            new Date(tanggal),
            Number(jenisKasId),
            Number(mediaPembayaranId)
        );

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate transaction.`,
            data: updatedTransaction
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deleteTransactionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedTransaction = await deleteTransactionService(Number(id));
        const message = deletedTransaction.isDeleted ? `Berhasil menghapus transaction dengan uraian: ${deletedTransaction.uraian}.` : `Berhasil memulihkan transaction dengan uraian: ${deletedTransaction.uraian}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deletePermanentTransactionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        await deletePermanentTransactionService(Number(id));

        return res.status(200).json({
            success: true,
            message: "Berhasil menghapus permanen transaction."
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getDraftTransactionController(req: Request, res: Response<ResponseApiType>) { 
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftTransactions = await getDraftTransactionService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan daftar transaction draft.",
            data: draftTransactions.data,
            meta: draftTransactions.meta
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getDashboardSummaryController(req: Request, res: Response<ResponseApiType>) {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();
        const summary = await getDashboardSummaryService(year);
        
        return res.status(200).json({
            success: true,
            message: `Berhasil mendapatkan ringkasan dashboard tahun ${year}.`,
            data: summary
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
