import { Router } from "express";
import {
    getAllFavoriteTransaksiController,
    getFavoriteTransaksiByIdController,
    createFavoriteTransaksiController,
    updateFavoriteTransaksiController,
    deleteFavoriteTransaksiController,
} from "../controllers/favorite_transaksi.controller";
import {
    createFavoriteTransaksiValidator,
    updateFavoriteTransaksiValidator,
    idValidator
} from "../validator/favorite_transaksi.validator";
import { jwtCheckToken } from "../middlewares/jwt_check_token";
import { isRole } from "../middlewares/is_role";
import upload from "../middlewares/upload";

const router = Router();

router.get("/", jwtCheckToken, isRole("admin", "superadmin"), getAllFavoriteTransaksiController);
router.get("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, getFavoriteTransaksiByIdController);
router.post("/", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), createFavoriteTransaksiValidator, createFavoriteTransaksiController);
router.put("/:id", jwtCheckToken, isRole("admin", "superadmin"), upload.none(), updateFavoriteTransaksiValidator, updateFavoriteTransaksiController);
router.delete("/:id", jwtCheckToken, isRole("admin", "superadmin"), idValidator, deleteFavoriteTransaksiController);

export default router;
