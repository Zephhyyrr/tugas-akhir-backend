import { Router } from "express";
import {
    getAllMediaPembayaranController,
    getMediaPembayaranByIdController,
    createMediaPembayaranController,
    updateMediaPembayaranController,
    deleteMediaPembayaranController,
    deletePermanentMediaPembayaranController,
    getDraftMediaPembayaranController
} from "../controllers/media_pembayaran.controller";
import {
    createMediaPembayaranValidator,
    updateMediaPembayaranValidator,
    idValidator
} from "../validator/media_pembayaran.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllMediaPembayaranController);
router.get("/draft", jwtCheckToken, isRole("admin", "superadmin"), getDraftMediaPembayaranController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getMediaPembayaranByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), createMediaPembayaranValidator, createMediaPembayaranController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), updateMediaPembayaranValidator, updateMediaPembayaranController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteMediaPembayaranController);
router.delete("/:id/delete-permanent", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deletePermanentMediaPembayaranController);

export default router;
