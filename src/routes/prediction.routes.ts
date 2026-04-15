import express from 'express';
import { getDonationPrediction, } from '../controllers/prediction.controller';

const router = express.Router();

router.post('/predict', getDonationPrediction);

export default router;