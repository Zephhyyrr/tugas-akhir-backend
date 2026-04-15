import { Request, Response, NextFunction } from 'express';
import { fetchPrediction } from '../services/prediction.service';
import { handlerAnyError } from '../errors/api_errors';
import { ResponseApiType } from '../types/api_types';

export const getDonationPrediction = async (req: Request, res: Response<ResponseApiType>, next: NextFunction): Promise<void> => {
    try {
        const { start_date, end_date } = req.body;

        const predictionData = await fetchPrediction(start_date, end_date);
        res.status(200).json({
            success: true,
            message: 'Prediksi donasi berhasil diambil',
            data: predictionData
        });

    } catch (error) {
        handlerAnyError(error, res);
    }
};