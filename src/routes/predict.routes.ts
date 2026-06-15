import { Router } from "express";
import { getPredictions } from "../controllers/predict.controller";

const predictRouter = Router();

predictRouter.get("/", getPredictions);

export default predictRouter;
