import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllKelompokKurbanService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const kelompokKurban = await prisma.kelompokKurban.findMany({
        where: { isDeleted: false },
        skip,
        take,
        include: { peserta: true },
    });

    const totalItems = await prisma.kelompokKurban.count({
        where: { isDeleted: false }
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: kelompokKurban.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

export async function getKelompokKurbanByIdService(id: number) {
    const kelompokKurban = await prisma.kelompokKurban.findUnique({
        where: { id },
        include: { peserta: true },
    });

    if (!kelompokKurban) {
        throw new AppError(`Kelompok Kurban dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...kelompokKurban,
        createdAt: kelompokKurban.createdAt,
        updatedAt: kelompokKurban.updatedAt
    };
}

export async function createKelompokKurbanService(nama: string, tahun: string) {
    const kelompokKurban = await prisma.kelompokKurban.create({
        data: { nama, tahun },
        include: { peserta: true },
    });

    return {
        ...kelompokKurban,
        createdAt: kelompokKurban.createdAt,
        updatedAt: kelompokKurban.updatedAt
    };
}

export async function updateKelompokKurbanService(id: number, nama: string, tahun: string) {
    await getKelompokKurbanByIdService(id);

    const updated = await prisma.kelompokKurban.update({
        where: { id },
        data: { nama, tahun },
        include: { peserta: true },
    });

    return {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
    };
}

export async function deleteKelompokKurbanService(id: number) {
    const kelompokKurban = await prisma.kelompokKurban.findUnique({
        where: { id },
        include: { peserta: true },
    });

    if (!kelompokKurban) {
        throw new AppError(`Kelompok Kurban dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !kelompokKurban.isDeleted;

    const deleted = await prisma.kelompokKurban.update({
        where: { id },
        data: { isDeleted: newDeletedStatus },
        include: { peserta: true },
    });

    return {
        ...deleted,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt
    };
}

export async function deletePermanentKelompokKurbanService(id: number) {
    const kelompokKurban = await prisma.kelompokKurban.findUnique({
        where: { id },
    });

    if (!kelompokKurban) {
        throw new AppError(`Kelompok Kurban dengan id: ${id}, tidak tersedia.`);
    }

    if (!kelompokKurban.isDeleted) {
        throw new AppError(`Kelompok Kurban dengan id: ${id} belum dihapus (soft delete).`);
    }

    await prisma.kelompokKurban.delete({ where: { id } });
}

export async function getDraftKelompokKurbanService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const kelompokKurban = await prisma.kelompokKurban.findMany({
        where: { isDeleted: true },
        skip,
        take,
        include: { peserta: true },
    });
    const totalItems = await prisma.kelompokKurban.count({
        where: { isDeleted: true },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: kelompokKurban.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

