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
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload from "../middlewares/upload";
const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllTransactionController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getTransactionByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), createTransactionValidator, createTransactionController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), updateTransactionValidator, updateTransactionController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteTransactionController);

export default router;
