import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllKeteranganTransaksiService,
    getKeteranganTransaksiByIdService,
    createKeteranganTransaksiService,
    updateKeteranganTransaksiService,
    deleteKeteranganTransaksiService,
    getDraftKeteranganTransaksiService
} from "../services/keterangan_transaksi.service";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllKeteranganTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const keteranganTransaksi = await getAllKeteranganTransaksiService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data keterangan transaksi.",
            data: keteranganTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getKeteranganTransaksiByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const keteranganTransaksi = await getKeteranganTransaksiByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail keterangan transaksi.",
            data: keteranganTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createKeteranganTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { nama } = req.body;

        const newKeteranganTransaksi = await createKeteranganTransaksiService(nama);

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan keterangan transaksi: ${newKeteranganTransaksi.nama}.`,
            data: newKeteranganTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateKeteranganTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { nama } = req.body;

        const updatedKeteranganTransaksi = await updateKeteranganTransaksiService(Number(id), nama);

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate keterangan transaksi: ${updatedKeteranganTransaksi.nama}.`,
            data: updatedKeteranganTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deleteKeteranganTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedKeteranganTransaksi = await deleteKeteranganTransaksiService(Number(id));
        const message = deletedKeteranganTransaksi.isDeleted ? `Berhasil menghapus keterangan transaksi: ${deletedKeteranganTransaksi.nama}.` : `Berhasil memulihkan keterangan transaksi: ${deletedKeteranganTransaksi.nama}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getDraftKeteranganTransaksiController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftKeteranganTransaksi = await getDraftKeteranganTransaksiService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data keterangan transaksi yang dihapus.",
            data: draftKeteranganTransaksi
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
