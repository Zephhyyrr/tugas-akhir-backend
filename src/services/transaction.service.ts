import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllTransactionService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const transactions = await prisma.transaction.findMany({
        skip,
        take,
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });

    const totalItems = await prisma.transaction.count();
    const meta = getPagingData(totalItems, pageNumber, pageSize);
    return {
        data: transactions.map(t => ({
            ...t,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt
        })),
        meta: meta
    };
}

export async function getTransactionByIdService(id: number) {
    const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });

    if (!transaction) {
        throw new AppError(`Transaction dengan id: ${id}, tidak tersedia.`);
    }

    return {
        ...transaction,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
    };
}

export async function createTransactionService(
    saldo: number,
    kredit: number,
    debet: number,
    uraian: string,
    tanggal: Date,
    userId: number,
    keteranganTransaksiId: number
) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        throw new AppError(`User dengan id: ${userId}, tidak tersedia.`);
    }

    const keteranganExists = await prisma.keteranganTransaksi.findUnique({
        where: { id: keteranganTransaksiId }
    });
    if (!keteranganExists) {
        throw new AppError(`Keterangan Transaksi dengan id: ${keteranganTransaksiId}, tidak tersedia.`);
    }

    const transaction = await prisma.transaction.create({
        data: {
            saldo,
            kredit,
            debet,
            uraian,
            tanggal,
            userId,
            keteranganTransaksiId,
        },
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });

    return {
        ...transaction,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
    };
}

export async function updateTransactionService(
    id: number,
    saldo: number,
    kredit: number,
    debet: number,
    uraian: string,
    tanggal: Date
) {
    await getTransactionByIdService(id);

    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            saldo,
            kredit,
            debet,
            uraian,
            tanggal,
        },
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });

    return {
        ...updated,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt
    };
}

export async function deleteTransactionService(id: number) {
    const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });

    if (!transaction) {
        throw new AppError(`Transaction dengan id: ${id}, tidak tersedia.`);
    }

    const newDeletedStatus = !transaction.isDeleted;

    const deleted = await prisma.transaction.update({
        where: { id },
        data: { isDeleted: newDeletedStatus },
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });

    return {
        ...deleted,
        createdAt: deleted.createdAt,
        updatedAt: deleted.updatedAt
    };
}
