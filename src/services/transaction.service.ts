import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/api_errors";
import { getPagination, getPagingData } from "../utils/pagination";

function handlePrismaError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw new AppError('Data tidak ditemukan.');
        if (e.code === 'P2003') throw new AppError('Relasi tidak valid: periksa jenisKasId atau mediaPembayaranId.');
    }
    throw e;
}

export async function getAllTransactionService(page: number, limit: number, filters: any = {}) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);

    const AND: any[] = [{ isDeleted: false }];

    if (filters.search) {
        AND.push({
            OR: [
                { uraian: { contains: filters.search, mode: 'insensitive' } },
                { jenisKas: { nama: { contains: filters.search, mode: 'insensitive' } } },
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

    if (filters.startDate) dateGte = new Date(`${filters.startDate}T00:00:00.000Z`);
    if (filters.endDate) dateLte = new Date(`${filters.endDate}T23:59:59.999Z`);

    if (filters.year && filters.year !== 'all') {
        const year = Number(filters.year);
        if (filters.month && filters.month !== 'all') {
            const month = Number(filters.month) - 1;
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
            dateGte = dateGte ? new Date(Math.max(dateGte.getTime(), start.getTime())) : start;
            dateLte = dateLte ? new Date(Math.min(dateLte.getTime(), end.getTime())) : end;
        } else {
            const start = new Date(year, 0, 1);
            const end = new Date(year, 11, 31, 23, 59, 59, 999);
            dateGte = dateGte ? new Date(Math.max(dateGte.getTime(), start.getTime())) : start;
            dateLte = dateLte ? new Date(Math.min(dateLte.getTime(), end.getTime())) : end;
        }
    }

    if (dateGte || dateLte) {
        const tanggalFilter: any = {};
        if (dateGte) tanggalFilter.gte = dateGte;
        if (dateLte) tanggalFilter.lte = dateLte;
        AND.push({ tanggal: tanggalFilter });
    }

    const whereClause = { AND };

    const qOpts: any = {
        where: whereClause,
        include: { user: true, jenisKas: true, mediaPembayaran: true },
        orderBy: { tanggal: 'desc' },
    };
    if (limit > 0) { qOpts.skip = skip; qOpts.take = take; }

    const [transactions, grouped] = await Promise.all([
        prisma.transaction.findMany(qOpts),
        prisma.transaction.groupBy({
            by: ['tipe'],
            where: whereClause,
            _sum: { nominal: true },
            _count: { _all: true },
        }),
    ]);

    const totalItems = grouped.reduce((s, g) => s + (g._count._all ?? 0), 0);
    const totalIncome = Number(grouped.find(g => g.tipe === 'uang_masuk')?._sum?.nominal ?? 0);
    const totalExpense = Number(grouped.find(g => g.tipe === 'uang_keluar')?._sum?.nominal ?? 0);

    return {
        data: transactions,
        meta: getPagingData(totalItems, pageNumber, limit > 0 ? pageSize : totalItems),
        summary: { totalIncome, totalExpense, netBalance: totalIncome - totalExpense },
    };
}

export async function getTransactionByIdService(id: number) {
    const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: { user: true, jenisKas: true, mediaPembayaran: true },
    });
    if (!transaction) throw new AppError(`Transaction dengan id: ${id}, tidak tersedia.`);
    return transaction;
}

export async function createTransactionService(
    uraian: string, tipe: any, nominal: number, debit: number, kredit: number,
    tanggal: Date, userId: number, jenisKasId: number, mediaPembayaranId: number
) {
    try {
        return await prisma.transaction.create({
            data: { uraian, tipe, nominal, debit, kredit, tanggal, userId, jenisKasId, mediaPembayaranId },
            include: { user: true, jenisKas: true, mediaPembayaran: true },
        });
    } catch (e) { return handlePrismaError(e); }
}

export async function updateTransactionService(
    id: number, uraian: string, tipe: any, nominal: number, debit: number, kredit: number,
    tanggal: Date, jenisKasId: number, mediaPembayaranId: number
) {
    try {
        return await prisma.transaction.update({
            where: { id },
            data: { uraian, tipe, nominal, debit, kredit, tanggal, jenisKasId, mediaPembayaranId },
            include: { user: true, jenisKas: true, mediaPembayaran: true },
        });
    } catch (e) { return handlePrismaError(e); }
}

export async function deleteTransactionService(id: number) {
    return prisma.$transaction(async (tx) => {
        const existing = await tx.transaction.findUniqueOrThrow({
            where: { id },
            select: { id: true, isDeleted: true, uraian: true },
        });
        return tx.transaction.update({
            where: { id },
            data: { isDeleted: !existing.isDeleted },
            select: { id: true, isDeleted: true, uraian: true },
        });
    }).catch(handlePrismaError);
}

export async function deletePermanentTransactionService(id: number) {
    const { count } = await prisma.transaction.deleteMany({
        where: { id, isDeleted: true },
    });

    if (count === 0) {
        const exists = await prisma.transaction.count({ where: { id } });
        if (exists === 0) throw new AppError(`Transaction dengan id: ${id}, tidak tersedia.`);
        throw new AppError(`Transaction dengan id: ${id} belum dihapus (soft delete).`);
    }
}

export async function getDraftTransactionService(page: number, limit: number) {
    const { skip, take, pageNumber, pageSize } = getPagination(page, limit);
    const [transactions, totalItems] = await Promise.all([
        prisma.transaction.findMany({
            skip, take,
            where: { isDeleted: true },
            include: { user: true, jenisKas: true, mediaPembayaran: true },
            orderBy: { tanggal: 'desc' },
        }),
        prisma.transaction.count({ where: { isDeleted: true } }),
    ]);
    return { data: transactions, meta: getPagingData(totalItems, pageNumber, pageSize) };
}

export async function getDashboardSummaryService(year: number | 'all') {
    const yearCond = year === 'all' ? Prisma.empty : Prisma.sql`AND EXTRACT(YEAR FROM t.tanggal) = ${year}`;
    const periodExpr = year === 'all'
        ? Prisma.sql`EXTRACT(YEAR  FROM tanggal)::int`
        : Prisma.sql`EXTRACT(MONTH FROM tanggal)::int`;

    type DashRow = {
        totals: { total_income: string; total_expense: string };
        chart: Array<{ period: number; income: string; expense: string }> | null;
        jenis_kas: Array<{ nama: string; count: number; income: string; expense: string }> | null;
        avail_years: number[] | null;
    };

    const [row] = await prisma.$queryRaw<DashRow[]>`
        WITH
        base AS (
            SELECT t.tipe, t.nominal, t.tanggal, jk."nama" AS jk_nama
            FROM   "Transaction" t
            LEFT   JOIN "JenisKas" jk ON t."jenisKasId" = jk.id
            WHERE  t."isDeleted" = false ${yearCond}
        ),
        totals AS (
            SELECT
                COALESCE(SUM(CASE WHEN tipe::text = 'uang_masuk'  THEN nominal END), 0) AS total_income,
                COALESCE(SUM(CASE WHEN tipe::text = 'uang_keluar' THEN nominal END), 0) AS total_expense
            FROM base
        ),
        chart_base AS (
            SELECT t.tipe, t.nominal, t.tanggal
            FROM   "Transaction" t
            WHERE  t."isDeleted" = false
              AND  t."jenisKasId" = 1
              ${yearCond}
        ),
        chart AS (
            SELECT
                ${periodExpr}                                                                AS period,
                COALESCE(SUM(CASE WHEN tipe::text = 'uang_masuk'  THEN nominal END), 0)    AS income,
                COALESCE(SUM(CASE WHEN tipe::text = 'uang_keluar' THEN nominal END), 0)    AS expense
            FROM   chart_base
            GROUP  BY ${periodExpr}
        ),
        jenis_kas AS (
            SELECT
                COALESCE(jk_nama, 'Tidak Diketahui')                                        AS nama,
                COUNT(*)::int                                                               AS count,
                COALESCE(SUM(CASE WHEN tipe::text = 'uang_masuk'  THEN nominal END), 0)    AS income,
                COALESCE(SUM(CASE WHEN tipe::text = 'uang_keluar' THEN nominal END), 0)    AS expense
            FROM   base
            GROUP  BY jk_nama
        ),
        avail_years AS (
            SELECT DISTINCT EXTRACT(YEAR FROM tanggal)::int AS year
            FROM   "Transaction"
            WHERE  "isDeleted" = false
        )
        SELECT
            (SELECT row_to_json(t) FROM totals t)                                                           AS totals,
            COALESCE((SELECT json_agg(c ORDER BY c.period)         FROM chart c),        '[]'::json)        AS chart,
            COALESCE((SELECT json_agg(jk ORDER BY jk.income DESC)  FROM jenis_kas jk),   '[]'::json)        AS jenis_kas,
            COALESCE((SELECT json_agg(y.year ORDER BY y.year DESC) FROM avail_years y),  '[]'::json)        AS avail_years
    `;

    const totalIncome = Number(row.totals?.total_income) || 0;
    const totalExpense = Number(row.totals?.total_expense) || 0;
    const availableYears = (row.avail_years ?? []).map(Number);
    const chartRows = row.chart ?? [];
    const jenisKasRows = row.jenis_kas ?? [];

    const labels: string[] = [];
    const incomeData: number[] = [];
    const expenseData: number[] = [];

    if (year === 'all') {
        chartRows
            .sort((a, b) => a.period - b.period)
            .forEach(r => {
                labels.push(String(r.period));
                incomeData.push(Number(r.income) || 0);
                expenseData.push(Number(r.expense) || 0);
            });
    } else {
        const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const inc = Array(12).fill(0);
        const exp = Array(12).fill(0);
        chartRows.forEach(r => {
            const idx = Number(r.period) - 1;
            if (idx >= 0 && idx < 12) { inc[idx] = Number(r.income) || 0; exp[idx] = Number(r.expense) || 0; }
        });
        labels.push(...monthLabels);
        incomeData.push(...inc);
        expenseData.push(...exp);
    }

    const jenisKasSummary = year === 'all' ? [] : jenisKasRows.map(r => ({
        nama: r.nama,
        count: Number(r.count) || 0,
        income: Number(r.income) || 0,
        expense: Number(r.expense) || 0,
        balance: (Number(r.income) || 0) - (Number(r.expense) || 0),
    }));

    // ── Per-Kas Summary Cards (always, all years) ──────────────────────────
    type PerKasRow = { jenis_kas_id: number; nama: string; income: string; expense: string };
    const perKasRows = await prisma.$queryRaw<PerKasRow[]>`
        SELECT
            jk.id                                                                               AS jenis_kas_id,
            jk."nama"                                                                           AS nama,
            COALESCE(SUM(CASE WHEN t.tipe::text = 'uang_masuk'  THEN t.nominal END), 0)        AS income,
            COALESCE(SUM(CASE WHEN t.tipe::text = 'uang_keluar' THEN t.nominal END), 0)        AS expense
        FROM   "JenisKas" jk
        LEFT   JOIN "Transaction" t ON t."jenisKasId" = jk.id AND t."isDeleted" = false
        WHERE  jk."isDeleted" = false
        GROUP  BY jk.id, jk."nama"
        ORDER  BY jk.id ASC
    `;

    const perKasCards = perKasRows.map(r => ({
        jenisKasId: Number(r.jenis_kas_id),
        nama: r.nama,
        income: Number(r.income) || 0,
        expense: Number(r.expense) || 0,
        balance: (Number(r.income) || 0) - (Number(r.expense) || 0),
    }));

    // ── Pie Chart Data: Kas Anak Yatim (id=2) & Kas TPQ (id=3) per tahun ──
    type PieYearRow = { year: number; income: string; expense: string };

    const [yatimRows, tpqRows] = await Promise.all([
        prisma.$queryRaw<PieYearRow[]>`
            SELECT
                EXTRACT(YEAR FROM t.tanggal)::int                                               AS year,
                COALESCE(SUM(CASE WHEN t.tipe::text = 'uang_masuk'  THEN t.nominal END), 0)    AS income,
                COALESCE(SUM(CASE WHEN t.tipe::text = 'uang_keluar' THEN t.nominal END), 0)    AS expense
            FROM   "Transaction" t
            WHERE  t."jenisKasId" = 2 AND t."isDeleted" = false
            GROUP  BY EXTRACT(YEAR FROM t.tanggal)
            ORDER  BY year ASC
        `,
        prisma.$queryRaw<PieYearRow[]>`
            SELECT
                EXTRACT(YEAR FROM t.tanggal)::int                                               AS year,
                COALESCE(SUM(CASE WHEN t.tipe::text = 'uang_masuk'  THEN t.nominal END), 0)    AS income,
                COALESCE(SUM(CASE WHEN t.tipe::text = 'uang_keluar' THEN t.nominal END), 0)    AS expense
            FROM   "Transaction" t
            WHERE  t."jenisKasId" = 3 AND t."isDeleted" = false
            GROUP  BY EXTRACT(YEAR FROM t.tanggal)
            ORDER  BY year ASC
        `,
    ]);

    const pieYatim = yatimRows.map(r => ({
        year: Number(r.year),
        income: Number(r.income) || 0,
        expense: Number(r.expense) || 0,
    }));

    const pieTpq = tpqRows.map(r => ({
        year: Number(r.year),
        income: Number(r.income) || 0,
        expense: Number(r.expense) || 0,
    }));

    return {
        totalIncome,
        totalExpense,
        currentBalance: totalIncome - totalExpense,
        mode: year === 'all' ? 'yearly' as const : 'monthly' as const,
        chart: { labels, incomeData, expenseData },
        jenisKasSummary,
        availableYears,
        perKasCards,
        pieYatim,
        pieTpq,
    };
}
