import { Router } from "express";
import {
    getAllContentController,
    getContentByIdController,
    createContentController,
    updateContentController,
    deleteContentController
} from "../controllers/content.controller";
import {
    createContentValidator,
    updateContentValidator,
    idValidator
} from "../validator/content.validator";

const router = Router();

router.get("/", getAllContentController);
router.get("/:id", idValidator, getContentByIdController);
router.post("/", createContentValidator, createContentController);
router.put("/:id", updateContentValidator, updateContentController);
router.delete("/:id", idValidator, deleteContentController);

export default router;
