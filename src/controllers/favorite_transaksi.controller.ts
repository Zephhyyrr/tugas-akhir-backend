import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllFavoriteTransaksiService,
    getFavoriteTransaksiByIdService,
    createFavoriteTransaksiService,
    updateFavoriteTransaksiService,
    deleteFavoriteTransaksiService,
    getDraftFavoriteTransaksiService
} from "../services/favorite_transaksi.service";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllFavoriteTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const favoriteTransaksi = await getAllFavoriteTransaksiService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data favorite transaksi.",
            data: favoriteTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getFavoriteTransaksiByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const favoriteTransaksi = await getFavoriteTransaksiByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail favorite transaksi.",
            data: favoriteTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createFavoriteTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { uraian } = req.body;

        const newFavoriteTransaksi = await createFavoriteTransaksiService(uraian);

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan favorite transaksi: ${newFavoriteTransaksi.uraian}.`,
            data: newFavoriteTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateFavoriteTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { uraian } = req.body;

        const updatedFavoriteTransaksi = await updateFavoriteTransaksiService(Number(id), uraian);

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate favorite transaksi: ${updatedFavoriteTransaksi.uraian}.`,
            data: updatedFavoriteTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deleteFavoriteTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedFavoriteTransaksi = await deleteFavoriteTransaksiService(Number(id));
        const message = deletedFavoriteTransaksi.isDeleted ? `Berhasil menghapus favorite transaksi: ${deletedFavoriteTransaksi.uraian}.` : `Berhasil memulihkan favorite transaksi: ${deletedFavoriteTransaksi.uraian}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}


export async function getDraftFavoriteTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftFavoriteTransaksi = await getDraftFavoriteTransaksiService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data favorite transaksi yang dihapus.",
            data: draftFavoriteTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
