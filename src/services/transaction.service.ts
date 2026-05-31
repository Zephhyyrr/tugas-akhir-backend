import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

export async function getAllTransactionService(page: number, limit: number, filters: any = {}) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);

    let AND: any[] = [{ isDeleted: false }];

    if (filters.search) {
        AND.push({
            OR: [
                { uraian: { contains: filters.search, mode: 'insensitive' } },
                { jenisKas: { nama: { contains: filters.search, mode: 'insensitive' } } }
            ]
        });
    }

    if (filters.type === 'income') {
        AND.push({ tipe: 'uang_masuk' });
    } else if (filters.type === 'expense') {
        AND.push({ tipe: 'uang_keluar' });
    }

    if (filters.jenisKasId && filters.jenisKasId !== 'all') {
        AND.push({ jenisKasId: Number(filters.jenisKasId) });
    }

    let dateGte: Date | null = null;
    let dateLte: Date | null = null;

    if (filters.startDate) {
        dateGte = new Date(`${filters.startDate}T00:00:00.000Z`);
    }
    if (filters.endDate) {
        dateLte = new Date(`${filters.endDate}T23:59:59.999Z`);
    }

    if (filters.year && filters.year !== 'all') {
        const year = Number(filters.year);
        if (filters.month && filters.month !== 'all') {
            const month = Number(filters.month) - 1;
            const startOfMonth = new Date(year, month, 1);
            const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);
            dateGte = dateGte ? new Date(Math.max(dateGte.getTime(), startOfMonth.getTime())) : startOfMonth;
            dateLte = dateLte ? new Date(Math.min(dateLte.getTime(), endOfMonth.getTime())) : endOfMonth;
        } else {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
            dateGte = dateGte ? new Date(Math.max(dateGte.getTime(), startOfYear.getTime())) : startOfYear;
            dateLte = dateLte ? new Date(Math.min(dateLte.getTime(), endOfYear.getTime())) : endOfYear;
        }
    }

    if (dateGte || dateLte) {
        const tanggalFilter: any = {};
        if (dateGte) tanggalFilter.gte = dateGte;
        if (dateLte) tanggalFilter.lte = dateLte;
        AND.push({ tanggal: tanggalFilter });
    }

    const whereClause = { AND };

    // Use negative limit to skip pagination (e.g., export excel)
    const queryOptions: any = {
        where: whereClause,
        include: {
            user: true,
            jenisKas: true,
            mediaPembayaran: true,
        },
        orderBy: { tanggal: 'desc' },
    };

    if (limit > 0) {
        queryOptions.skip = skip;
        queryOptions.take = take;
    }

    const transactions = await prisma.transaction.findMany(queryOptions);

    const totalItems = await prisma.transaction.count({
        where: whereClause,
    });
    
    const meta = getPagingData(totalItems, pageNumber, limit > 0 ? pageSize : totalItems);

    const [sumIncome, sumExpense] = await Promise.all([
        prisma.transaction.aggregate({ where: { AND: [...AND, { tipe: 'uang_masuk' }] }, _sum: { nominal: true } }),
        prisma.transaction.aggregate({ where: { AND: [...AND, { tipe: 'uang_keluar' }] }, _sum: { nominal: true } }),
    ]);

    const totalIncome = Number(sumIncome._sum.nominal) || 0;
    const totalExpense = Number(sumExpense._sum.nominal) || 0;
    const netBalance = totalIncome - totalExpense;

    return {
        data: transactions.map(t => ({
            ...t,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt
        })),
        meta: meta,
        summary: { totalIncome, totalExpense, netBalance }
    };
}

export async function getTransactionByIdService(id: number) {
    const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
            user: true,
            jenisKas: true,
            mediaPembayaran: true,
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
    uraian: string,
    tipe: any,
    nominal: number,
    debit: number,
    kredit: number,
    tanggal: Date,
    userId: number,
    jenisKasId: number,
    mediaPembayaranId: number
) {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
        throw new AppError(`User dengan id: ${userId}, tidak tersedia.`);
    }

    const jenisKasExists = await prisma.jenisKas.findUnique({ where: { id: jenisKasId } });
    if (!jenisKasExists) {
        throw new AppError(`Jenis Kas dengan id: ${jenisKasId}, tidak tersedia.`);
    }

    const mediaExists = await prisma.mediaPembayaran.findUnique({ where: { id: mediaPembayaranId } });
    if (!mediaExists) {
        throw new AppError(`Media Pembayaran dengan id: ${mediaPembayaranId}, tidak tersedia.`);
    }

    const transaction = await prisma.transaction.create({
        data: {
            uraian,
            tipe,
            nominal,
            debit,
            kredit,
            tanggal,
            userId,
            jenisKasId,
            mediaPembayaranId,
        },
        include: {
            user: true,
            jenisKas: true,
            mediaPembayaran: true,
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
    uraian: string,
    tipe: any,
    nominal: number,
    debit: number,
    kredit: number,
    tanggal: Date,
    jenisKasId: number,
    mediaPembayaranId: number
) {
    await getTransactionByIdService(id);

    const jenisKasExists = await prisma.jenisKas.findUnique({ where: { id: jenisKasId } });
    if (!jenisKasExists) {
        throw new AppError(`Jenis Kas dengan id: ${jenisKasId}, tidak tersedia.`);
    }

    const mediaExists = await prisma.mediaPembayaran.findUnique({ where: { id: mediaPembayaranId } });
    if (!mediaExists) {
        throw new AppError(`Media Pembayaran dengan id: ${mediaPembayaranId}, tidak tersedia.`);
    }

    const updated = await prisma.transaction.update({
        where: { id },
        data: {
            uraian,
            tipe,
            nominal,
            debit,
            kredit,
            tanggal,
            jenisKasId,
            mediaPembayaranId,
        },
        include: {
            user: true,
            jenisKas: true,
            mediaPembayaran: true,
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
            jenisKas: true,
            mediaPembayaran: true,
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
            jenisKas: true,
            mediaPembayaran: true,
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
            jenisKas: true,
            mediaPembayaran: true,
        },
        orderBy: { tanggal: 'desc' },
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

export async function getDashboardSummaryService(year: number) {
    const rawData = await prisma.$queryRaw<any[]>`
        SELECT 
            EXTRACT(MONTH FROM tanggal) as month,
            SUM(CASE WHEN tipe::text = 'uang_masuk' THEN nominal ELSE 0 END) as "income",
            SUM(CASE WHEN tipe::text = 'uang_keluar' THEN nominal ELSE 0 END) as "expense"
        FROM "Transaction"
        WHERE "isDeleted" = false AND EXTRACT(YEAR FROM tanggal) = ${year}
        GROUP BY EXTRACT(MONTH FROM tanggal)
    `;

    const incomePerMonth = Array(12).fill(0);
    const expensePerMonth = Array(12).fill(0);
    let totalIncome = 0;
    let totalExpense = 0;

    rawData.forEach(row => {
        const monthIndex = Number(row.month) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            const inc = Number(row.income) || 0;
            const exp = Number(row.expense) || 0;
            incomePerMonth[monthIndex] = inc;
            expensePerMonth[monthIndex] = exp;
            totalIncome += inc;
            totalExpense += exp;
        }
    });

    return {
        totalIncome,
        totalExpense,
        currentBalance: totalIncome - totalExpense,
        monthly: {
            incomePerMonth,
            expensePerMonth
        }
    };
}
