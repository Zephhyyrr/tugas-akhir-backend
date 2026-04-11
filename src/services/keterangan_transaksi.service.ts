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
        data: keteranganTransaksi,
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

    return keteranganTransaksi;
}

export async function createKeteranganTransaksiService(nama: string) {
    const keteranganTransaksi = await prisma.keteranganTransaksi.create({
        data: { nama },
        include: { transactions: true },
    });

    return keteranganTransaksi;
}

export async function updateKeteranganTransaksiService(id: number, nama: string) {
    await getKeteranganTransaksiByIdService(id);

    const updated = await prisma.keteranganTransaksi.update({
        where: { id },
        data: { nama },
        include: { transactions: true },
    });

    return updated;
}

export async function deleteKeteranganTransaksiService(id: number) {
    await getKeteranganTransaksiByIdService(id);

    const deleted = await prisma.keteranganTransaksi.delete({
        where: { id }
    });

    return deleted;
}
