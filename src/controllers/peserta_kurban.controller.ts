import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllPesertaKurbanService,
    getPesertaKurbanByIdService,
    createPesertaKurbanService,
    updatePesertaKurbanService,
    deletePesertaKurbanService,
    deletePermanentPesertaKurbanService,
    getDraftPesertaKurbanService
} from "../services/peserta_kurban.service";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllPesertaKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const pesertaKurban = await getAllPesertaKurbanService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data peserta kurban.",
            data: pesertaKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getPesertaKurbanByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const pesertaKurban = await getPesertaKurbanByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail peserta kurban.",
            data: pesertaKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createPesertaKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { nama, nominal, tipe, mediaPembayaranId, kelompokKurbanId } = req.body;

        const newPesertaKurban = await createPesertaKurbanService(nama, Number(nominal), tipe, Number(mediaPembayaranId), kelompokKurbanId ? Number(kelompokKurbanId) : null);

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan peserta kurban: ${newPesertaKurban.nama}.`,
            data: newPesertaKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updatePesertaKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { nama, nominal, tipe, mediaPembayaranId, kelompokKurbanId } = req.body;

        const updatedPesertaKurban = await updatePesertaKurbanService(Number(id), nama, Number(nominal), tipe, Number(mediaPembayaranId), kelompokKurbanId ? Number(kelompokKurbanId) : null);

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate peserta kurban: ${updatedPesertaKurban.nama}.`,
            data: updatedPesertaKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deletePesertaKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedPesertaKurban = await deletePesertaKurbanService(Number(id));
        const message = deletedPesertaKurban.isDeleted ? `Berhasil menghapus peserta kurban: ${deletedPesertaKurban.nama}.` : `Berhasil memulihkan peserta kurban: ${deletedPesertaKurban.nama}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deletePermanentPesertaKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        await deletePermanentPesertaKurbanService(Number(id));

        return res.status(200).json({
            success: true,
            message: "Berhasil menghapus permanen peserta kurban."
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getDraftPesertaKurbanController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftPesertaKurban = await getDraftPesertaKurbanService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data peserta kurban yang dihapus.",
            data: draftPesertaKurban
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
