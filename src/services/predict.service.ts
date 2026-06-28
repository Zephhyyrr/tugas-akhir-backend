import axios from "axios";
import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";

const MODEL_API = process.env.API_MODELS || "http://127.0.0.1:5000";

export async function getIncomePredictionService() {
    const transactions = await prisma.transaction.findMany({
        where: { jenisKasId: 1, tipe: 'uang_masuk', isDeleted: false },
        select: { tanggal: true, nominal: true },
        orderBy: { tanggal: 'asc' }
    });

    const response = await axios.post(`${MODEL_API}/predict/income`, {
        months_ahead: 1,
        transactions: transactions
    });

    if (response.data.status === "success" || response.data.success) {
        return response.data.data;
    }
    throw new AppError(response.data.message || "Model API mengembalikan error.", 502);
}

export async function getExpensePredictionService() {
    const transactions = await prisma.transaction.findMany({
        where: { jenisKasId: 1, tipe: 'uang_keluar', isDeleted: false },
        select: { tanggal: true, nominal: true },
        orderBy: { tanggal: 'asc' }
    });

    const response = await axios.post(`${MODEL_API}/predict/expense`, {
        months_ahead: 1,
        transactions: transactions
    });

    if (response.data.status === "success" || response.data.success) {
        return response.data.data;
    }
    throw new AppError(response.data.message || "Model API mengembalikan error.", 502);
}


export async function savePredictionService(
    userId: number,
    nominal: number,
    tipe: string,
    tanggalTarget: string
) {
    return prisma.prediction.create({
        data: {
            nominal,
            tipe: tipe as any,
            tanggalTarget: new Date(tanggalTarget),
            userId,
            jenisKasId: 1
        }
    });
}

export async function saveAllocationsService(predictionId: number, allocations: any[]) {
    const incomingIds = allocations.map((a: any) => a.id).filter((id: any) => id !== undefined);

    await prisma.budgetAllocation.deleteMany({
        where: {
            predictionId,
            id: { notIn: incomingIds }
        }
    });

    for (const alloc of allocations) {
        if (alloc.id) {
            await prisma.budgetAllocation.update({
                where: { id: alloc.id },
                data: {
                    nama: alloc.nama,
                    persentase: Number(alloc.persentase),
                    nominal: Number(alloc.nominal)
                }
            });
        } else {
            await prisma.budgetAllocation.create({
                data: {
                    predictionId,
                    nama: alloc.nama,
                    persentase: Number(alloc.persentase),
                    nominal: Number(alloc.nominal)
                }
            });
        }
    }
}

export async function getPredictionHistoryService(userId: number) {
    return prisma.prediction.findMany({
        where: { userId },
        include: { allocations: true },
        orderBy: { createdAt: "desc" }
    });
}

export async function getPredictionByIdService(id: number, userId: number) {
    const prediction = await prisma.prediction.findUnique({
        where: { id },
        include: { allocations: true }
    });
    if (!prediction || prediction.userId !== userId) return null;
    return prediction;
}

export async function deletePredictionService(id: number, userId: number) {
    const prediction = await prisma.prediction.findUnique({ where: { id } });
    if (!prediction || prediction.userId !== userId) return false;
    
    await prisma.budgetAllocation.deleteMany({
        where: { predictionId: id }
    });
    
    await prisma.prediction.delete({ where: { id } });
    return true;
}
