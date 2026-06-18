import { Request, Response } from "express";
import axios from "axios";
import prisma from "../config/prisma";

const callModelApi = async (req: Request, res: Response, endpoint: string) => {
    try {
        // Kirim hanya months_ahead ke Python API.
        // History lag/residual sudah tersimpan di dalam file .pkl dari notebook Anda.
        const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, {
            months_ahead: 1
        });

        if (response.data.status === "success" || response.data.success) {
            res.json({
                success: true,
                data: response.data.data
            });
        } else {
            res.status(400).json({
                success: false,
                message: response.data.message || "Model API mengembalikan error."
            });
        }

    } catch (error: any) {
        console.error(`Error memanggil Model API (Port 5000): ${error.message}`);

        let errorMsg = "Gagal menghubungi Model AI API.";
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        }

        res.status(500).json({
            success: false,
            message: errorMsg,
            details: error.message
        });
    }
};

export const getIncomePrediction = async (req: Request, res: Response): Promise<void> => {
    await callModelApi(req, res, "/predict/income");
};

export const getExpensePrediction = async (req: Request, res: Response): Promise<void> => {
    await callModelApi(req, res, "/predict/expense");
};

export const savePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nominal, tipe, tanggalTarget } = req.body;
        const userId = Number((req as any).user?.id);

        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const prediction = await prisma.prediction.create({
            data: {
                nominal: Number(nominal),
                tipe: tipe as any,
                tanggalTarget: new Date(tanggalTarget),
                userId,
                jenisKasId: 1
            }
        });

        res.status(201).json({
            success: true,
            message: "Berhasil menyimpan hasil prediksi.",
            data: prediction
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal menyimpan prediksi.", details: error.message });
    }
};

export const allocatePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nominal } = req.body;

        const total = Number(nominal);
        const allocations = [
            { nama: "Biaya Operasional", persentase: 40, nominal: total * 0.40 },
            { nama: "Pembangunan/Renovasi", persentase: 30, nominal: total * 0.30 },
            { nama: "Kegiatan Sosial/Keagamaan", persentase: 20, nominal: total * 0.20 },
            { nama: "Dana Cadangan", persentase: 10, nominal: total * 0.10 }
        ];

        res.json({
            success: true,
            data: allocations
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal membuat alokasi.", details: error.message });
    }
};

export const saveAllocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { predictionId, allocations } = req.body;

        await prisma.budgetAllocation.createMany({
            data: allocations.map((alloc: any) => ({
                predictionId: Number(predictionId),
                nama: alloc.nama,
                persentase: Number(alloc.persentase),
                nominal: Number(alloc.nominal)
            }))
        });

        res.status(201).json({
            success: true,
            message: "Berhasil menyimpan alokasi budget."
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal menyimpan alokasi.", details: error.message });
    }
};

export const getPredictionHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number((req as any).user?.id);

        const history = await prisma.prediction.findMany({
            where: { userId },
            include: { allocations: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: history
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal mengambil riwayat.", details: error.message });
    }
};

export const getPredictionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = Number((req as any).user?.id);

        const prediction = await prisma.prediction.findUnique({
            where: { id: Number(id) },
            include: { allocations: true }
        });

        if (!prediction || prediction.userId !== userId) {
            res.status(404).json({ success: false, message: "Prediksi tidak ditemukan." });
            return;
        }

        res.json({
            success: true,
            data: prediction
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal mengambil detail prediksi.", details: error.message });
    }
};

export const deletePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = Number((req as any).user?.id);

        const prediction = await prisma.prediction.findUnique({
            where: { id: Number(id) }
        });

        if (!prediction || prediction.userId !== userId) {
            res.status(404).json({ success: false, message: "Prediksi tidak ditemukan." });
            return;
        }

        await prisma.prediction.delete({
            where: { id: Number(id) }
        });

        res.json({
            success: true,
            message: "Berhasil menghapus prediksi."
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Gagal menghapus prediksi.", details: error.message });
    }
};
