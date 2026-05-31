import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllFavoriteTransaksiService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const favoriteTransaksi = await prisma.favoriteTransaksi.findMany({
        skip,
        take,
        
    });

    const totalItems = await prisma.favoriteTransaksi.count();
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: favoriteTransaksi.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

export async function getFavoriteTransaksiByIdService(id: number) {
    const favoriteTransaksi = await prisma.favoriteTransaksi.findUnique({
        where: { id },
        
    });

    if (!favoriteTransaksi) {
        throw new AppError(`Favorite Transaksi dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...favoriteTransaksi,
        createdAt: favoriteTransaksi.createdAt,
        updatedAt: favoriteTransaksi.updatedAt
    };
}

export async function createFavoriteTransaksiService(uraian: string) {
    const favoriteTransaksi = await prisma.favoriteTransaksi.create({
        data: { uraian },
        
    });

    return {
        ...favoriteTransaksi,
        createdAt: favoriteTransaksi.createdAt,
        updatedAt: favoriteTransaksi.updatedAt
    };
}

export async function updateFavoriteTransaksiService(id: number, uraian: string) {
    await getFavoriteTransaksiByIdService(id);

    const updated = await prisma.favoriteTransaksi.update({
        where: { id },
        data: { uraian },
        
    });

    return {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
    };
}

export async function deleteFavoriteTransaksiService(id: number) {
    const favoriteTransaksi = await prisma.favoriteTransaksi.findUnique({
        where: { id },
        
    });

    if (!favoriteTransaksi) {
        throw new AppError(`Favorite Transaksi dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !favoriteTransaksi.isDeleted;

    const deleted = await prisma.favoriteTransaksi.update({
        where: { id },
        data: { isDeleted: newDeletedStatus },
        
    });

    return {
        ...deleted,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt
    };
}

export async function deletePermanentFavoriteTransaksiService(id: number) {
    const favoriteTransaksi = await prisma.favoriteTransaksi.findUnique({
        where: { id },
    });

    if (!favoriteTransaksi) {
        throw new AppError(`Favorite Transaksi dengan id: ${id}, tidak tersedia.`);
    }

    if (!favoriteTransaksi.isDeleted) {
        throw new AppError(`Favorite Transaksi dengan id: ${id} belum dihapus (soft delete).`);
    }

    await prisma.favoriteTransaksi.delete({ where: { id } });
}

export async function getDraftFavoriteTransaksiService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const favoriteTransaksi = await prisma.favoriteTransaksi.findMany({
        where: { isDeleted: true },
        skip,
        take,
        
    });
    const totalItems = await prisma.favoriteTransaksi.count({
        where: { isDeleted: true },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: favoriteTransaksi.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

