import { Router } from "express";
import { 
    getIncomePrediction, 
    getExpensePrediction,
    savePrediction,
    saveAllocations,
    getPredictionHistory,
    getPredictionById,
    deletePrediction
} from "../controllers/predict.controller";
import { jwtCheckToken } from "../middlewares/jwt_check_token";

const predictRouter = Router();

predictRouter.use(jwtCheckToken);

predictRouter.get("/income", getIncomePrediction);
predictRouter.get("/expense", getExpensePrediction);
predictRouter.post("/save", savePrediction);
predictRouter.post("/save-allocations", saveAllocations);
predictRouter.get("/history", getPredictionHistory);
predictRouter.get("/:id", getPredictionById);
predictRouter.delete("/:id", deletePrediction);

export default predictRouter;
