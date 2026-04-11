import { Router } from "express";
import {
    getAllTransactionController,
    getTransactionByIdController,
    createTransactionController,
    updateTransactionController,
    deleteTransactionController
} from "../controllers/transaction.controller";
import {
    createTransactionValidator,
    updateTransactionValidator,
    idValidator
} from "../validator/transaction.validator";

const router = Router();

router.get("/", getAllTransactionController);
router.get("/:id", idValidator, getTransactionByIdController);
router.post("/", createTransactionValidator, createTransactionController);
router.put("/:id", updateTransactionValidator, updateTransactionController);
router.delete("/:id", idValidator, deleteTransactionController);

export default router;
