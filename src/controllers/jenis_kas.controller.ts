import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllJenisKasService,
    getJenisKasByIdService,
    createJenisKasService,
    updateJenisKasService,
    deleteJenisKasService,
    getDraftJenisKasService
} from "../services/jenis_kas.service";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllJenisKasController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const jenisKas = await getAllJenisKasService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data jenis kas.",
            data: jenisKas
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getJenisKasByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const jenisKas = await getJenisKasByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail jenis kas.",
            data: jenisKas
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createJenisKasController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { nama } = req.body;

        const newJenisKas = await createJenisKasService(nama);

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan jenis kas: ${newJenisKas.nama}.`,
            data: newJenisKas
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateJenisKasController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { nama } = req.body;

        const updatedJenisKas = await updateJenisKasService(Number(id), nama);

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate jenis kas: ${updatedJenisKas.nama}.`,
            data: updatedJenisKas
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deleteJenisKasController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedJenisKas = await deleteJenisKasService(Number(id));
        const message = deletedJenisKas.isDeleted ? `Berhasil menghapus jenis kas: ${deletedJenisKas.nama}.` : `Berhasil memulihkan jenis kas: ${deletedJenisKas.nama}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}


export async function getDraftJenisKasController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftJenisKas = await getDraftJenisKasService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data jenis kas yang dihapus.",
            data: draftJenisKas
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
