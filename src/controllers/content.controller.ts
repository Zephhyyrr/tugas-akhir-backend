import { Request, Response } from "express";
import { ResponseApiType } from "../types/api_types";
import {
    getAllContentService,
    getContentByIdService,
    createContentService,
    updateContentService,
    deleteContentService
} from "../services/content.service";
import { handlerAnyError } from "../errors/api_errors";

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
        const { judul, isi, status, userId } = req.body;
        const baseUrl = process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:3000";

        const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
        
        let gambarUrls: string[] = [];
        let videoUrls: string[] = [];

        if (files?.gambar) {
            gambarUrls = files.gambar.map(file => `${baseUrl}/uploads/${file.filename}`);
        }

        if (files?.video) {
            videoUrls = files.video.map(file => `${baseUrl}/uploads/${file.filename}`);
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
        const baseUrl = process.env.PORT ? `http://localhost:${process.env.PORT}` : "http://localhost:3000";

        const files = req.files as { [key: string]: Express.Multer.File[] } | undefined;
        
        let gambarUrl: string | undefined;
        let videoUrl: string | undefined;

        if (files?.gambar && files.gambar.length > 0) {
            gambarUrl = files.gambar.map(file => `${baseUrl}/uploads/${file.filename}`).join(',');
        }

        if (files?.video && files.video.length > 0) {
            videoUrl = files.video.map(file => `${baseUrl}/uploads/${file.filename}`).join(',');
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

        return res.status(200).json({
            success: true,
            message: `Berhasil menghapus content: ${deletedContent.judul}`
        });
    } catch (error) {
        return handlerAnyError(error, res);
    }
}
