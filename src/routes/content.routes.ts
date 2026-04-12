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
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload, { validateUploadSizeByType } from "../middlewares/upload";

const router = Router();

router.get("/", getAllContentController);
router.get("/:id", idValidator, getContentByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.fields([{ name: 'image', maxCount: 10 }, { name: 'videos', maxCount: 5 }]), validateUploadSizeByType, createContentValidator, createContentController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.fields([{ name: 'image', maxCount: 10 }, { name: 'videos', maxCount: 5 }]), validateUploadSizeByType, updateContentValidator, updateContentController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteContentController);

export default router;
