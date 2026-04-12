import { Router } from "express";
import {getAlluserController, createUserController, getUserByIdController, updateUserController, deleteUserController, updatePhotoProfileController} from "../controllers/user.controller";
import {createUserValidator,updateUserValidator, idValidator, updatePhotoValidator} from "../validator/user.validator";
import upload, { validateUploadSizeByType } from "../middlewares/upload";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
const router = Router();

router.get("/", jwtCheckToken, isRole("superadmin"), getAlluserController);
router.get("/:id", jwtCheckToken, isRole("superadmin", "admin"), idValidator, getUserByIdController);
router.post("/", jwtCheckToken, isRole("superadmin"), createUserValidator, createUserController);
router.put("/:id", jwtCheckToken, isRole("superadmin"), updateUserValidator, updateUserController);
router.delete("/:id", jwtCheckToken, isRole("superadmin"), idValidator, deleteUserController);
router.patch("/:id/photo", jwtCheckToken, isRole("superadmin", "admin"), updatePhotoValidator, upload.single("fotoProfile"), validateUploadSizeByType, updatePhotoProfileController);

export default router;