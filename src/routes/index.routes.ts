import { Router } from "express";
const apiRouter = Router()
import userRoutes from "./user.routes";
import contentRoutes from "./content.routes";
import jenisKasRoutes from "./jenis_kas.routes";
import mediaPembayaranRoutes from "./media_pembayaran.routes";
import favoriteTransaksiRoutes from "./favorite_transaksi.routes";
import kelompokKurbanRoutes from "./kelompok_kurban.routes";
import pesertaKurbanRoutes from "./peserta_kurban.routes";
import transactionRoutes from "./transaction.routes";
import authRoutes from "./auth.routes";

apiRouter.get("/health", (req, res) => {
    res.json({ message: "API sukses berjalan" })
});
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/contents", contentRoutes);
apiRouter.use("/jenis-kas", jenisKasRoutes);
apiRouter.use("/media-pembayaran", mediaPembayaranRoutes);
apiRouter.use("/favorite-transaksi", favoriteTransaksiRoutes);
apiRouter.use("/kelompok-kurban", kelompokKurbanRoutes);
apiRouter.use("/peserta-kurban", pesertaKurbanRoutes);
apiRouter.use("/transaksi", transactionRoutes);

export default apiRouter