import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllPesertaKurbanService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const pesertaKurban = await prisma.pesertaKurban.findMany({
        where: { isDeleted: false },
        skip,
        take,
        include: { mediaPembayaran: true, kelompokKurban: true },
    });

    const totalItems = await prisma.pesertaKurban.count({
        where: { isDeleted: false }
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: pesertaKurban.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

export async function getPesertaKurbanByIdService(id: number) {
    const pesertaKurban = await prisma.pesertaKurban.findUnique({
        where: { id },
        include: { mediaPembayaran: true, kelompokKurban: true },
    });

    if (!pesertaKurban) {
        throw new AppError(`Peserta Kurban dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...pesertaKurban,
        createdAt: pesertaKurban.createdAt,
        updatedAt: pesertaKurban.updatedAt
    };
}

export async function createPesertaKurbanService(nama: string, nominal: number, tipe: any, mediaPembayaranId: number, kelompokKurbanId: number | null, tahun: string) {
    const pesertaKurban = await prisma.pesertaKurban.create({
        data: { nama, nominal, tipe, mediaPembayaranId, kelompokKurbanId, tahun },
        include: { mediaPembayaran: true, kelompokKurban: true },
    });

    return {
        ...pesertaKurban,
        createdAt: pesertaKurban.createdAt,
        updatedAt: pesertaKurban.updatedAt
    };
}

export async function updatePesertaKurbanService(id: number, nama: string, nominal: number, tipe: any, mediaPembayaranId: number, kelompokKurbanId: number | null, tahun: string) {
    await getPesertaKurbanByIdService(id);

    const updated = await prisma.pesertaKurban.update({
        where: { id },
        data: { nama, nominal, tipe, mediaPembayaranId, kelompokKurbanId, tahun },
        include: { mediaPembayaran: true, kelompokKurban: true },
    });

    return {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
    };
}

export async function deletePesertaKurbanService(id: number) {
    const pesertaKurban = await prisma.pesertaKurban.findUnique({
        where: { id },
        include: { mediaPembayaran: true, kelompokKurban: true },
    });

    if (!pesertaKurban) {
        throw new AppError(`Peserta Kurban dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !pesertaKurban.isDeleted;

    const deleted = await prisma.pesertaKurban.update({
        where: { id },
        data: { isDeleted: newDeletedStatus },
        include: { mediaPembayaran: true, kelompokKurban: true },
    });

    return {
        ...deleted,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt
    };
}

export async function deletePermanentPesertaKurbanService(id: number) {
    const pesertaKurban = await prisma.pesertaKurban.findUnique({
        where: { id },
    });

    if (!pesertaKurban) {
        throw new AppError(`Peserta Kurban dengan id: ${id}, tidak tersedia.`);
    }

    if (!pesertaKurban.isDeleted) {
        throw new AppError(`Peserta Kurban dengan id: ${id} belum dihapus (soft delete).`);
    }

    await prisma.pesertaKurban.delete({ where: { id } });
}

export async function getDraftPesertaKurbanService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const pesertaKurban = await prisma.pesertaKurban.findMany({
        where: { isDeleted: true },
        skip,
        take,
        include: { mediaPembayaran: true, kelompokKurban: true },
    });
    const totalItems = await prisma.pesertaKurban.count({
        where: { isDeleted: true },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: pesertaKurban.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}
