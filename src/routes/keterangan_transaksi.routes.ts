import { Router } from "express";
import {
    getAllKeteranganTransaksiController,
    getKeteranganTransaksiByIdController,
    createKeteranganTransaksiController,
    updateKeteranganTransaksiController,
    deleteKeteranganTransaksiController,
    deletePermanentKeteranganTransaksiController,
    getDraftKeteranganTransaksiController
} from "../controllers/keterangan_transaksi.controller";
import {
    createKeteranganTransaksiValidator,
    updateKeteranganTransaksiValidator,
    idValidator
} from "../validator/keterangan_transaksi.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllKeteranganTransaksiController);
router.get("/draft", jwtCheckToken, isRole("admin", "superadmin"), getDraftKeteranganTransaksiController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getKeteranganTransaksiByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), createKeteranganTransaksiValidator, createKeteranganTransaksiController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), updateKeteranganTransaksiValidator, updateKeteranganTransaksiController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteKeteranganTransaksiController);
router.delete("/:id/delete-permanent", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deletePermanentKeteranganTransaksiController);

export default router;
