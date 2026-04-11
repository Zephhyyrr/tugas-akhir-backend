import { Router } from "express";
import {getAlluserController, createUserController, updateUserController, deleteUserController, updatePhotoProfileController} from "../controllers/user.controller";
import {createUserValidator,updateUserValidator, idValidator, updatePhotoValidator} from "../validator/user.validator";
import upload, { validateUploadSizeByType } from "../middlewares/upload";

const router = Router();

router.get("/", getAlluserController);
router.post("/", createUserValidator, createUserController);
router.put("/:id", updateUserValidator, updateUserController);
router.delete("/:id", idValidator, deleteUserController);
router.patch("/:id/photo", updatePhotoValidator, upload.single("fotoProfile"), validateUploadSizeByType, updatePhotoProfileController
);

export default router;