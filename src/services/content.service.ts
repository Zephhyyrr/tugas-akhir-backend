import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllContentService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const contents = await prisma.content.findMany({
        skip,
        take,
        where: { isDeleted: false },
        include: { user: true },
    });

    const totalItems = await prisma.content.count({
        where: { isDeleted: false },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: contents,
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

    return content;
}

export async function createContentService(
    judul: string,
    isi: string,
    status: string,
    userId: number,
    gambarUrl?: string,
    videoUrl?: string
) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        throw new AppError(`User dengan id: ${userId}, tidak tersedia.`);
    }

    const content = await prisma.content.create({
        data: {
            judul,
            isi,
            status,
            userId,
            gambarUrl,
            videoUrl
        },
        include: { user: true },
    });

    return content;
}

export async function updateContentService(
    id: number,
    judul: string,
    isi: string,
    status: string,
    gambarUrl?: string,
    videoUrl?: string
) {
    await getContentByIdService(id);

    const updated = await prisma.content.update({
        where: { id },
        data: {
            judul,
            isi,
            status,
            gambarUrl,
            videoUrl
        },
        include: { user: true },
    });

    return updated;
}

export async function deleteContentService(id: number) {
    await getContentByIdService(id);

    const deleted = await prisma.content.update({
        where: { id },
        data: { isDeleted: true }
    });

    return deleted;
}
