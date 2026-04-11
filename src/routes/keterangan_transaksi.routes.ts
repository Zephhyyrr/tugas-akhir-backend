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

const router = Router();

router.get("/", getAllKeteranganTransaksiController);
router.get("/:id", idValidator, getKeteranganTransaksiByIdController);
router.post("/", createKeteranganTransaksiValidator, createKeteranganTransaksiController);
router.put("/:id", updateKeteranganTransaksiValidator, updateKeteranganTransaksiController);
router.delete("/:id", idValidator, deleteKeteranganTransaksiController);

export default router;
