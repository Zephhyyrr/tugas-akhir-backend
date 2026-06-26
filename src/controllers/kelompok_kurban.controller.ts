import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllKelompokKurbanService,
    getKelompokKurbanByIdService,
    createKelompokKurbanService,
    updateKelompokKurbanService,
    deleteKelompokKurbanService,
    getDraftKelompokKurbanService
} from "../services/kelompok_kurban.service";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllKelompokKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const kelompokKurban = await getAllKelompokKurbanService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data kelompok kurban.",
            data: kelompokKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getKelompokKurbanByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const kelompokKurban = await getKelompokKurbanByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail kelompok kurban.",
            data: kelompokKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createKelompokKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { nama, tahun } = req.body;

        const newKelompokKurban = await createKelompokKurbanService(nama, tahun);

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan kelompok kurban: ${newKelompokKurban.nama}.`,
            data: newKelompokKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateKelompokKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { nama, tahun } = req.body;

        const updatedKelompokKurban = await updateKelompokKurbanService(Number(id), nama, tahun);

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate kelompok kurban: ${updatedKelompokKurban.nama}.`,
            data: updatedKelompokKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deleteKelompokKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedKelompokKurban = await deleteKelompokKurbanService(Number(id));
        const message = deletedKelompokKurban.isDeleted ? `Berhasil menghapus kelompok kurban: ${deletedKelompokKurban.nama}.` : `Berhasil memulihkan kelompok kurban: ${deletedKelompokKurban.nama}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}


export async function getDraftKelompokKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftKelompokKurban = await getDraftKelompokKurbanService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data kelompok kurban yang dihapus.",
            data: draftKelompokKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
