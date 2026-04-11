import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllTransactionService,
    getTransactionByIdService,
    createTransactionService,
    updateTransactionService,
    deleteTransactionService
} from "../services/transaction.service";
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
        const { saldo, kredit, debet, uraian, tanggal, userId, keteranganTransaksiId } = req.body;

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
        const { saldo, kredit, debet, uraian, tanggal } = req.body;

        const updatedTransaction = await updateTransactionService(
            Number(id),
            saldo,
            kredit,
            debet,
            uraian,
            new Date(tanggal)
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

        await deleteTransactionService(Number(id));

        return res.status(200).json({
            success: true,
            message: `Berhasil menghapus transaction`
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
