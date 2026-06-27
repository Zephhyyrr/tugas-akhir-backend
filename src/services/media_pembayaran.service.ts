import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllMediaPembayaranService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const mediaPembayaran = await prisma.mediaPembayaran.findMany({
        where: { isDeleted: false },
        skip,
        take,
        include: { transactions: true, pesertaKurban: true },
    });

    const totalItems = await prisma.mediaPembayaran.count({
        where: { isDeleted: false }
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: mediaPembayaran.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

export async function getMediaPembayaranByIdService(id: number) {
    const mediaPembayaran = await prisma.mediaPembayaran.findUnique({
        where: { id },
        include: { transactions: true, pesertaKurban: true },
    });

    if (!mediaPembayaran) {
        throw new AppError(`Media Pembayaran dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...mediaPembayaran,
        createdAt: mediaPembayaran.createdAt,
        updatedAt: mediaPembayaran.updatedAt
    };
}

export async function createMediaPembayaranService(nama: string) {
    const existing = await prisma.mediaPembayaran.findUnique({
        where: { nama }
    });

    if (existing) {
        throw new AppError("Media pembayaran sudah ada");
    }

    const mediaPembayaran = await prisma.mediaPembayaran.create({
        data: { nama },
        include: { transactions: true, pesertaKurban: true },
    });

    return {
        ...mediaPembayaran,
        createdAt: mediaPembayaran.createdAt,
        updatedAt: mediaPembayaran.updatedAt
    };
}

export async function updateMediaPembayaranService(id: number, nama: string) {
    await getMediaPembayaranByIdService(id);

    const existing = await prisma.mediaPembayaran.findUnique({
        where: { nama }
    });

    if (existing && existing.id !== id) {
        throw new AppError("Media pembayaran sudah ada");
    }

    const updated = await prisma.mediaPembayaran.update({
        where: { id },
        data: { nama },
        include: { transactions: true, pesertaKurban: true },
    });

    return {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
    };
}

export async function deleteMediaPembayaranService(id: number) {
    const mediaPembayaran = await prisma.mediaPembayaran.findUnique({
        where: { id },
        include: { transactions: true, pesertaKurban: true },
    });

    if (!mediaPembayaran) {
        throw new AppError(`Media Pembayaran dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !mediaPembayaran.isDeleted;

    const deleted = await prisma.mediaPembayaran.update({
        where: { id },
        data: { isDeleted: newDeletedStatus },
        include: { transactions: true, pesertaKurban: true },
    });

    return {
        ...deleted,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt
    };
}


export async function getDraftMediaPembayaranService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const mediaPembayaran = await prisma.mediaPembayaran.findMany({
        where: { isDeleted: true },
        skip,
        take,
        include: { transactions: true, pesertaKurban: true },
    });
    const totalItems = await prisma.mediaPembayaran.count({
        where: { isDeleted: true },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: mediaPembayaran.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

