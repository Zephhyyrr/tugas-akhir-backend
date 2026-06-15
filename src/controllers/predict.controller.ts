import { Request, Response } from "express";
import axios from "axios";

export const getPredictions = async (req: Request, res: Response): Promise<void> => {
    const weeks = req.query.weeks ? parseInt(req.query.weeks as string, 10) : 4;
    const startDate = req.query.startDate ? (req.query.startDate as string) : "";
    
    if (isNaN(weeks) || weeks <= 0) {
        res.status(400).json({ success: false, message: "Parameter weeks harus berupa angka positif." });
        return;
    }

    try {
        let apiUrl = `http://127.0.0.1:5000/predict?weeks=${weeks}`;
        if (startDate) {
            apiUrl += `&start_date=${encodeURIComponent(startDate)}`;
        }

        const response = await axios.get(apiUrl);
        
        // Teruskan data JSON dari model Python langsung ke Frontend
        res.json({ 
            success: true, 
            data: response.data.data 
        });

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
