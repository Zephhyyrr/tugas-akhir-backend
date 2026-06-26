import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllMediaPembayaranService,
    getMediaPembayaranByIdService,
    createMediaPembayaranService,
    updateMediaPembayaranService,
    deleteMediaPembayaranService,
    getDraftMediaPembayaranService
} from "../services/media_pembayaran.service";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllMediaPembayaranController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const mediaPembayaran = await getAllMediaPembayaranService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data media pembayaran.",
            data: mediaPembayaran
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getMediaPembayaranByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const mediaPembayaran = await getMediaPembayaranByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail media pembayaran.",
            data: mediaPembayaran
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createMediaPembayaranController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { nama } = req.body;

        const newMediaPembayaran = await createMediaPembayaranService(nama);

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan media pembayaran: ${newMediaPembayaran.nama}.`,
            data: newMediaPembayaran
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateMediaPembayaranController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { nama } = req.body;

        const updatedMediaPembayaran = await updateMediaPembayaranService(Number(id), nama);

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate media pembayaran: ${updatedMediaPembayaran.nama}.`,
            data: updatedMediaPembayaran
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deleteMediaPembayaranController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedMediaPembayaran = await deleteMediaPembayaranService(Number(id));
        const message = deletedMediaPembayaran.isDeleted ? `Berhasil menghapus media pembayaran: ${deletedMediaPembayaran.nama}.` : `Berhasil memulihkan media pembayaran: ${deletedMediaPembayaran.nama}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}


export async function getDraftMediaPembayaranController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftMediaPembayaran = await getDraftMediaPembayaranService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data media pembayaran yang dihapus.",
            data: draftMediaPembayaran
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
