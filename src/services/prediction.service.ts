import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { AppError } from '../errors/api_errors';

dotenv.config();

const API_MODELS = process.env.API_MODELS || 'http://localhost:5000';

export const fetchPrediction = async (startDate: string, endDate: string): Promise<any> => {
    try {
        const response = await axios.post(`${API_MODELS}/`, {
            start_date: startDate,
            end_date: endDate
        });
        
        if (response.data.status !== 'success') {
            throw new AppError('Gagal mendapatkan prediksi dari model API', 400);
        }
        
        return response.data.data;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 500) {
            throw new AppError('Model API sedang mengalami gangguan', 503);
        }
        
        if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
            const errorData = axiosError.response.data as any;
            const errorMessage = errorData.message || errorData.error || 'Error dari model API';
            throw new AppError(errorMessage, axiosError.response.status || 400);
        }
        
        throw new AppError('Gagal terhubung ke model API', 503);
    }
};