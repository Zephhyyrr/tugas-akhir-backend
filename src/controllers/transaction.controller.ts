import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllTransactionService,
    getTransactionByIdService,
    createTransactionService,
    updateTransactionService,
    deleteTransactionService,
    deletePermanentTransactionService,
    getDraftTransactionService
} from "../services/transaction.service";
import { AppError } from "../errors/api_errors";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllTransactionController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const transactions = await getAllTransactionService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data transaction.",
            data: transactions
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
        const { saldo, kredit, debet, uraian, tanggal, keteranganTransaksiId } = req.body;
        const userId = Number((req as any).user?.id);

        if (!Number.isInteger(userId)) {
            throw new AppError("User tidak valid.");
        }

        const newTransaction = await createTransactionService(
            saldo,
            kredit,
            debet,
            uraian,
            new Date(tanggal),
            userId,
            keteranganTransaksiId
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
        const { saldo, kredit, debet, uraian, tanggal, keteranganTransaksiId } = req.body;

        const updatedTransaction = await updateTransactionService(
            Number(id),
            saldo,
            kredit,
            debet,
            uraian,
            new Date(tanggal),
            keteranganTransaksiId ? Number(keteranganTransaksiId) : undefined
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
