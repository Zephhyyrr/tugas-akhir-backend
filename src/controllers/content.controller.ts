import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllContentService,
    getContentByIdService,
    createContentService,
    updateContentService,
    deleteContentService,
    deletePermanentContentService,
    getDraftContentService
} from "../services/content.service";
import { AppError } from "../errors/api_errors";
import { handlerAnyError } from "../errors/api_errors";

export async function getAllContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const jenis = req.query.jenis as string | undefined;

        const contents = await getAllContentService(page, limit, jenis);
        return res.status(200).json({
            success: true,
            message: "Mendapatkan data content.",
            data: contents
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getContentByIdController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const content = await getContentByIdService(Number(id));
        return res.status(200).json({
            success: true,
            message: "Mendapatkan detail content.",
            data: content
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function createContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { judul, isi, jenis, isTampil } = req.body;
        const reqFiles = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const gambarUrl = reqFiles?.['gambarUrl']?.map((file: any) => file.filename) || [];
        const videoUrl = reqFiles?.['videoUrl']?.[0]?.filename || undefined;
        const userId = Number((req as any).user?.id);

        if (!Number.isInteger(userId)) {
            throw new AppError("User tidak valid.");
        }

        const isTampilBool = isTampil === 'true' || isTampil === true;

        const newContent = await createContentService(
            judul,
            isi || "",
            gambarUrl,
            videoUrl,
            jenis,
            isTampilBool,
            userId
        );

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan content.`,
            data: newContent
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { judul, isi, jenis, isTampil } = req.body;
        const reqFiles = (req as any).files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        const newGambarUrl = reqFiles?.['gambarUrl']?.map((file: any) => file.filename);
        const newVideoUrl = reqFiles?.['videoUrl']?.[0]?.filename;

        const isTampilBool = isTampil === 'true' || isTampil === true;

        const content = await getContentByIdService(Number(id));

        const updatedContent = await updateContentService(
            Number(id),
            judul || content.judul,
            isi !== undefined ? isi : content.isi,
            newGambarUrl && newGambarUrl.length > 0 ? newGambarUrl : content.gambarUrl,
            newVideoUrl !== undefined ? newVideoUrl : content.videoUrl,
            jenis || content.jenis,
            isTampil !== undefined ? isTampilBool : content.isTampil
        );

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate content.`,
            data: updatedContent
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deleteContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const deletedContent = await deleteContentService(Number(id));
        const message = deletedContent.isDeleted ? `Berhasil menghapus content dengan judul: ${deletedContent.judul}.` : `Berhasil memulihkan content dengan judul: ${deletedContent.judul}.`;
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function deletePermanentContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        await deletePermanentContentService(Number(id));

        return res.status(200).json({
            success: true,
            message: "Berhasil menghapus permanen content."
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function getDraftContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const draftContents = await getDraftContentService(page, limit);
        return res.status(200).json({
            success: true,
            message: "Berhasil mendapatkan daftar content draft.",
            data: draftContents.data,
            meta: draftContents.meta
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
