import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllKeteranganTransaksiService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const keteranganTransaksi = await prisma.keteranganTransaksi.findMany({
        skip,
        take,
        include: { transactions: true },
    });

    const totalItems = await prisma.keteranganTransaksi.count();
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: keteranganTransaksi.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

export async function getKeteranganTransaksiByIdService(id: number) {
    const keteranganTransaksi = await prisma.keteranganTransaksi.findUnique({
        where: { id },
        include: { transactions: true },
    });

    if (!keteranganTransaksi) {
        throw new AppError(`Keterangan Transaksi dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...keteranganTransaksi,
        createdAt: keteranganTransaksi.createdAt,
        updatedAt: keteranganTransaksi.updatedAt
    };
}

export async function createKeteranganTransaksiService(nama: string) {
    const keteranganTransaksi = await prisma.keteranganTransaksi.create({
        data: { nama },
        include: { transactions: true },
    });

    return {
        ...keteranganTransaksi,
        createdAt: keteranganTransaksi.createdAt,
        updatedAt: keteranganTransaksi.updatedAt
    };
}

export async function updateKeteranganTransaksiService(id: number, nama: string) {
    await getKeteranganTransaksiByIdService(id);

    const updated = await prisma.keteranganTransaksi.update({
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

export async function deleteKeteranganTransaksiService(id: number) {
    const keteranganTransaksi = await prisma.keteranganTransaksi.findUnique({
        where: { id },
        include: { transactions: true },
    });

    if (!keteranganTransaksi) {
        throw new AppError(`Keterangan Transaksi dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !keteranganTransaksi.isDeleted;

    const deleted = await prisma.keteranganTransaksi.update({
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

export async function getDraftKeteranganTransaksiService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const keteranganTransaksi = await prisma.keteranganTransaksi.findMany({
        where: { isDeleted: true },
        skip,
        take,
        include: { transactions: true },
    });
    const totalItems = await prisma.keteranganTransaksi.count({
        where: { isDeleted: true },
    });
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: keteranganTransaksi.map(kt => ({
            ...kt,
            createdAt: kt.createdAt,
            updatedAt: kt.updatedAt
        })),
        meta: meta
    };
}

