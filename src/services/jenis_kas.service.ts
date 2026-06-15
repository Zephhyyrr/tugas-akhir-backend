import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllJenisKasService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const jenisKas = await prisma.jenisKas.findMany({
        where: { isDeleted: false },
        skip,
        take,
        include: { transactions: true },
    });

    const totalItems = await prisma.jenisKas.count({
        where: { isDeleted: false }
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: jenisKas.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

export async function getJenisKasByIdService(id: number) {
    const jenisKas = await prisma.jenisKas.findUnique({
        where: { id },
        include: { transactions: true },
    });

    if (!jenisKas) {
        throw new AppError(`Jenis Kas dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...jenisKas,
        createdAt: jenisKas.createdAt,
        updatedAt: jenisKas.updatedAt
    };
}

export async function createJenisKasService(nama: string) {
    const jenisKas = await prisma.jenisKas.create({
        data: { nama },
        include: { transactions: true },
    });

    return {
        ...jenisKas,
        createdAt: jenisKas.createdAt,
        updatedAt: jenisKas.updatedAt
    };
}

export async function updateJenisKasService(id: number, nama: string) {
    await getJenisKasByIdService(id);

    const updated = await prisma.jenisKas.update({
        where: { id },
        data: { nama },
        include: { transactions: true },
    });

    return {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
    };
}

export async function deleteJenisKasService(id: number) {
    const jenisKas = await prisma.jenisKas.findUnique({
        where: { id },
        include: { transactions: true },
    });

    if (!jenisKas) {
        throw new AppError(`Jenis Kas dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !jenisKas.isDeleted;

    const deleted = await prisma.jenisKas.update({
        where: { id },
        data: { isDeleted: newDeletedStatus },
        include: { transactions: true },
    });

    return {
        ...deleted,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt
    };
}

export async function deletePermanentJenisKasService(id: number) {
    const jenisKas = await prisma.jenisKas.findUnique({
        where: { id },
    });

    if (!jenisKas) {
        throw new AppError(`Jenis Kas dengan id: ${id}, tidak tersedia.`);
    }

    if (!jenisKas.isDeleted) {
        throw new AppError(`Jenis Kas dengan id: ${id} belum dihapus (soft delete).`);
    }

    await prisma.jenisKas.delete({ where: { id } });
}

export async function getDraftJenisKasService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const jenisKas = await prisma.jenisKas.findMany({
        where: { isDeleted: true },
        skip,
        take,
        include: { transactions: true },
    });
    const totalItems = await prisma.jenisKas.count({
        where: { isDeleted: true },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: jenisKas.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

