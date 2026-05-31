import { Router } from "express";
import {
    getAllKelompokKurbanController,
    getKelompokKurbanByIdController,
    createKelompokKurbanController,
    updateKelompokKurbanController,
    deleteKelompokKurbanController,
    deletePermanentKelompokKurbanController,
    getDraftKelompokKurbanController
} from "../controllers/kelompok_kurban.controller";
import {
    createKelompokKurbanValidator,
    updateKelompokKurbanValidator,
    idValidator
} from "../validator/kelompok_kurban.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllKelompokKurbanController);
router.get("/draft", jwtCheckToken, isRole("admin", "superadmin"), getDraftKelompokKurbanController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getKelompokKurbanByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), createKelompokKurbanValidator, createKelompokKurbanController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), updateKelompokKurbanValidator, updateKelompokKurbanController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteKelompokKurbanController);
router.delete("/:id/delete-permanent", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deletePermanentKelompokKurbanController);

export default router;
