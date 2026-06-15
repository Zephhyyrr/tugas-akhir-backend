import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";
import { JenisKonten } from "@prisma/client";

export async function getAllContentService(page: number, limit: number, jenis?: string) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const whereClause: any = { isDeleted: false };
    if (jenis) {
        whereClause.jenis = jenis as JenisKonten;
        whereClause.isTampil = true;
    }
    const contents = await prisma.content.findMany({
        where: { isDeleted: false },
        skip,
        take,
        where: whereClause,
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    });

    const totalItems = await prisma.content.count({
        where: whereClause,
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: contents.map(c => ({
            ...c,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt
        })),
        meta: meta
    };
}

export async function getContentByIdService(id: number) {
    const content = await prisma.content.findUnique({
        where: { id },
        include: { user: true },
    });

    if (!content || content.isDeleted) {
        throw new AppError(`Content dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...content,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
    };
}

export async function createContentService(
    judul: string,
    isi: string,
    gambarUrl: string,
    jenis: JenisKonten,
    isTampil: boolean,
    userId: number
) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        throw new AppError(`User dengan id: ${userId}, tidak tersedia.`);
    }

    if (['pengurus', 'imsakiyah', 'sejarah'].includes(jenis)) {
        const existingContent = await prisma.content.findFirst({
            where: { jenis, isDeleted: false }
        });
        if (existingContent) {
            throw new AppError(`Konten jenis ${jenis} hanya boleh ada 1. Silakan edit konten yang sudah ada.`);
        }
    }

    const content = await prisma.content.create({
        data: {
            judul,
            isi,
            gambarUrl,
            jenis,
            isTampil,
            userId
        },
        include: { user: true },
    });

    return {
        ...content,
        createdAt: content.createdAt,
        updatedAt: content.updatedAt
    };
}

export async function updateContentService(
    id: number,
    judul: string,
    isi: string,
    gambarUrl: string,
    jenis: JenisKonten,
    isTampil: boolean
) {
    const updated = await prisma.content.update({
        where: { id },
        data: {
            judul,
            isi,
            gambarUrl,
            jenis,
            isTampil
        },
        include: { user: true },
    });

    return {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
    };
}

export async function deleteContentService(id: number) {
    const content = await prisma.content.findUnique({
        where: { id },
        include: { user: true },
    });

    if (!content) {
        throw new AppError(`Content dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !content.isDeleted;

    const deleted = await prisma.content.update({
        where: { id },
        data: { isDeleted: newDeletedStatus },
        include: { user: true },
    });

    return {
        ...deleted,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt
    };
}

export async function deletePermanentContentService(id: number) {
    const content = await prisma.content.findUnique({
        where: { id },
    });

    if (!content) {
        throw new AppError(`Content dengan id: ${id}, tidak tersedia.`);
    }

    if (!content.isDeleted) {
        throw new AppError(`Content dengan id: ${id} belum dihapus (soft delete).`);
    }

    await prisma.content.delete({ where: { id } });
}

export async function getDraftContentService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const contents = await prisma.content.findMany({
        where: { isDeleted: true },
        skip,
        take,
        include: { user: true },
    });
    const totalItems = await prisma.content.count({
        where: { isDeleted: true },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: contents.map(c => ({
            ...c,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt
        })),
        meta: meta
    };
}
