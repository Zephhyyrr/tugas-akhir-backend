import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllContentService,
    getContentByIdService,
    createContentService,
    updateContentService,
    deleteContentService,
    publishedContentService,
    getDraftContentService
} from "../services/content.service";
import { AppError, handlerAnyError } from "../errors/api_errors";

export async function getAllContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const contents = await getAllContentService(page, limit);
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
        const { judul, isi, status } = req.body;
        const userId = Number((req as any).user?.id);

        if (!Number.isInteger(userId)) {
            throw new AppError("User tidak valid.");
        }

        const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
        
        let gambarUrls: string[] = [];
        let videoUrls: string[] = [];

        const gambarFiles = files?.gambarUrl || files?.gambar || files?.image;
        const videoFiles = files?.videoUrl || files?.video || files?.videos;

        if (gambarFiles) {
            gambarUrls = gambarFiles.map(file => `/uploads/${file.filename}`);
        }

        if (videoFiles) {
            videoUrls = videoFiles.map(file => `/uploads/${file.filename}`);
        }

        const newContent = await createContentService(
            judul,
            isi,
            status,
            userId,
            gambarUrls.length > 0 ? gambarUrls.join(',') : undefined,
            videoUrls.length > 0 ? videoUrls.join(',') : undefined
        );

        return res.status(201).json({
            success: true,
            message: `Berhasil menambahkan content: ${newContent.judul}.`,
            data: newContent
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function updateContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;
        const { judul, isi, status } = req.body;

        const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
        
        let gambarUrl: string | undefined;
        let videoUrl: string | undefined;

        const gambarFiles = files?.gambarUrl || files?.gambar || files?.image;
        const videoFiles = files?.videoUrl || files?.video || files?.videos;

        if (gambarFiles && gambarFiles.length > 0) {
            gambarUrl = gambarFiles.map(file => `/uploads/${file.filename}`).join(',');
        }

        if (videoFiles && videoFiles.length > 0) {
            videoUrl = videoFiles.map(file => `/uploads/${file.filename}`).join(',');
        }

        const updatedContent = await updateContentService(
            Number(id),
            judul,
            isi,
            status,
            gambarUrl,
            videoUrl
        );

        return res.status(200).json({
            success: true,
            message: `Berhasil mengupdate content: ${updatedContent.judul}.`,
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
        const message = deletedContent.isDeleted ? `Berhasil menghapus content: ${deletedContent.judul}.` : `Berhasil memulihkan content: ${deletedContent.judul}.`;
        return res.status(200).json({
            success: true,
            message
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
    }
        catch (error) {
        return handlerAnyError(error, res);
    }
}

export async function publishedContentController(req: Request, res: Response<ResponseApiType>) {
    try {
        const { id } = req.params;

        const updatedContent = await publishedContentService(Number(id));

        return res.status(200).json({
            success: true,
            message: `Berhasil mengubah status content: ${updatedContent.judul} menjadi ${updatedContent.status}.`,
            data: updatedContent
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
