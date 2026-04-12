import { Router } from "express";
import {
    getAllKeteranganTransaksiController,
    getKeteranganTransaksiByIdController,
    createKeteranganTransaksiController,
    updateKeteranganTransaksiController,
    deleteKeteranganTransaksiController
} from "../controllers/keterangan_transaksi.controller";
import {
    createKeteranganTransaksiValidator,
    updateKeteranganTransaksiValidator,
    idValidator
} from "../validator/keterangan_transaksi.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";

const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllKeteranganTransaksiController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getKeteranganTransaksiByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), createKeteranganTransaksiValidator, createKeteranganTransaksiController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), updateKeteranganTransaksiValidator, updateKeteranganTransaksiController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteKeteranganTransaksiController);

export default router;
