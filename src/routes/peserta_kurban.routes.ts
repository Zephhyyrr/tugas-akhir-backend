import { Router } from "express";
import {
    getAllPesertaKurbanController,
    getPesertaKurbanByIdController,
    createPesertaKurbanController,
    updatePesertaKurbanController,
    deletePesertaKurbanController,
    getDraftPesertaKurbanController,
    getAvailableKurbanYearsController,
    getPublicKurbanByTahunController
} from "../controllers/peserta_kurban.controller";
import {
    createPesertaKurbanValidator,
    updatePesertaKurbanValidator,
    idValidator
} from "../validator/peserta_kurban.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllPesertaKurbanController);
router.get("/draft", jwtCheckToken, isRole("admin", "superadmin"), getDraftPesertaKurbanController);
router.get("/public/years", getAvailableKurbanYearsController);
router.get("/public/kurban", getPublicKurbanByTahunController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getPesertaKurbanByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), createPesertaKurbanValidator, createPesertaKurbanController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), updatePesertaKurbanValidator, updatePesertaKurbanController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deletePesertaKurbanController);

export default router;
