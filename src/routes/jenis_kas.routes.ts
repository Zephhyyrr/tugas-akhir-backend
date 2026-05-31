import { Router } from "express";
import {
    getAllJenisKasController,
    getJenisKasByIdController,
    createJenisKasController,
    updateJenisKasController,
    deleteJenisKasController,
    deletePermanentJenisKasController,
    getDraftJenisKasController
} from "../controllers/jenis_kas.controller";
import {
    createJenisKasValidator,
    updateJenisKasValidator,
    idValidator
} from "../validator/jenis_kas.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllJenisKasController);
router.get("/draft", jwtCheckToken, isRole("admin", "superadmin"), getDraftJenisKasController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getJenisKasByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), createJenisKasValidator, createJenisKasController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), updateJenisKasValidator, updateJenisKasController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteJenisKasController);
router.delete("/:id/delete-permanent", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deletePermanentJenisKasController);

export default router;
