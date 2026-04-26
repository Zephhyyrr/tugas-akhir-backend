import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

const toAmount = (value: unknown) => {
    if (value === undefined || value === null || value === "") {
        return 0;
    }

    const amount = typeof value === "number" ? value : Number(value);
    if (Number.isNaN(amount)) {
        throw new AppError("Nilai transaksi harus berupa angka.");
    }

    return amount;
};

export async function getAllTransactionService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const transactions = await prisma.transaction.findMany({
        skip,
        take,
        where: { isDeleted: false },
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });

    const totalItems = await prisma.transaction.count({
        where: { isDeleted: false },
    });
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
    kredit: number,
    debet: number,
    uraian: string,
    tanggal: Date,
    userId: number,
    keteranganTransaksiId: number
) {
    const normalizedKredit = toAmount(kredit);
    const normalizedDebet = toAmount(debet);

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
            saldo: normalizedKredit - normalizedDebet,
            kredit: normalizedKredit,
            debet: normalizedDebet,
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
    kredit: number,
    debet: number,
    uraian: string,
    tanggal: Date,
    keteranganTransaksiId?: number
) {
    await getTransactionByIdService(id);

    const normalizedKredit = toAmount(kredit);
    const normalizedDebet = toAmount(debet);

    if (keteranganTransaksiId) {
        const keteranganExists = await prisma.keteranganTransaksi.findUnique({
            where: { id: keteranganTransaksiId }
        });

        if (!keteranganExists) {
            throw new AppError(`Keterangan Transaksi dengan id: ${keteranganTransaksiId}, tidak tersedia.`);
        }
    }

    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            saldo: normalizedKredit - normalizedDebet,
            kredit: normalizedKredit,
            debet: normalizedDebet,
            uraian,
            tanggal,
            ...(keteranganTransaksiId ? { keteranganTransaksiId } : {}),
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

export async function deletePermanentTransactionService(id: number) {
    const transaction = await prisma.transaction.findUnique({
        where: { id },
    });

    if (!transaction) {
        throw new AppError(`Transaction dengan id: ${id}, tidak tersedia.`);
    }

    if (!transaction.isDeleted) {
        throw new AppError(`Transaction dengan id: ${id} belum dihapus (soft delete).`);
    }

    await prisma.transaction.delete({ where: { id } });
}

export async function getDraftTransactionService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const transactions = await prisma.transaction.findMany({
        skip,
        take,
        where: { isDeleted: true },
        include: {
            user: true,
            keteranganTransaksi: true,
        },
    });
    const totalItems = await prisma.transaction.count({
        where: { isDeleted: true },
    });
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
