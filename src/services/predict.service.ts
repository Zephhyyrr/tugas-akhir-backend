import axios from "axios";
import prisma from "../config/prisma";
import { AppError } from "../errors/api_errors";

const MODEL_API = process.env.API_MODELS || "http://127.0.0.1:5000";

export async function getIncomePredictionService() {
    const response = await axios.post(`${MODEL_API}/predict/income`, {
        months_ahead: 1
    });

    if (response.data.status === "success" || response.data.success) {
        return response.data.data;
    }
    throw new AppError(response.data.message || "Model API mengembalikan error.", 502);
}

export async function getExpensePredictionService() {
    const response = await axios.post(`${MODEL_API}/predict/expense`, {
        months_ahead: 1
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

export async function allocatePredictionService(nominal: number) {
    const total = nominal;
    return [
        { nama: "Biaya Operasional", persentase: 40, nominal: total * 0.40 },
        { nama: "Pembangunan/Renovasi", persentase: 30, nominal: total * 0.30 },
        { nama: "Kegiatan Sosial/Keagamaan", persentase: 20, nominal: total * 0.20 },
        { nama: "Dana Cadangan", persentase: 10, nominal: total * 0.10 }
    ];
}

export async function saveAllocationsService(predictionId: number, allocations: any[]) {
    return prisma.budgetAllocation.createMany({
        data: allocations.map((alloc) => ({
            predictionId,
            nama: alloc.nama,
            persentase: Number(alloc.persentase),
            nominal: Number(alloc.nominal)
        }))
    });
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
    await prisma.prediction.delete({ where: { id } });
    return true;
}
