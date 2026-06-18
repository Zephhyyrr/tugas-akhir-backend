import { Request, Response } from "express";
import { AppError, handlerAnyError } from "../errors/api_errors";
import {
    getIncomePredictionService,
    getExpensePredictionService,
    savePredictionService,
    allocatePredictionService,
    saveAllocationsService,
    getPredictionHistoryService,
    getPredictionByIdService,
    deletePredictionService
} from "../services/predict.service";

export const getIncomePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getIncomePredictionService();
        res.json({ success: true, data });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};

export const getExpensePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getExpensePredictionService();
        res.json({ success: true, data });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};

export const savePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nominal, tipe, tanggalTarget } = req.body;
        const userId = Number((req as any).user?.id);

        if (!userId) throw new AppError("Unauthorized", 401);

        const prediction = await savePredictionService(userId, Number(nominal), tipe, tanggalTarget);
        res.status(201).json({ success: true, message: "Berhasil menyimpan hasil prediksi.", data: prediction });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};

export const allocatePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nominal } = req.body;
        const allocations = await allocatePredictionService(Number(nominal));
        res.json({ success: true, data: allocations });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};

export const saveAllocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { predictionId, allocations } = req.body;
        await saveAllocationsService(Number(predictionId), allocations);
        res.status(201).json({ success: true, message: "Berhasil menyimpan alokasi budget." });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};

export const getPredictionHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = Number((req as any).user?.id);
        const history = await getPredictionHistoryService(userId);
        res.json({ success: true, data: history });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};

export const getPredictionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = Number((req as any).user?.id);
        const prediction = await getPredictionByIdService(Number(id), userId);

        if (!prediction) throw new AppError("Prediksi tidak ditemukan.", 404);
        res.json({ success: true, data: prediction });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};

export const deletePrediction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = Number((req as any).user?.id);
        const deleted = await deletePredictionService(Number(id), userId);

        if (!deleted) throw new AppError("Prediksi tidak ditemukan.", 404);
        res.json({ success: true, message: "Berhasil menghapus prediksi." });
    } catch (error: any) {
        handlerAnyError(error, res);
    }
};
