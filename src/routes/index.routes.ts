import { Router } from "express";
const apiRouter = Router()
import userRoutes from "./user.routes";
import contentRoutes from "./content.routes";
import keteranganTransaksiRoutes from "./keterangan_transaksi.routes";
import transactionRoutes from "./transaction.routes";
import authRoutes from "./auth.routes";
import predictionRoutes from "./prediction.routes";

apiRouter.get("/health", (req, res) => {
    res.json({ message: "API sukses berjalan" })
});
apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/contents", contentRoutes);
apiRouter.use("/keterangan-transaksi", keteranganTransaksiRoutes);
apiRouter.use("/transaksi", transactionRoutes);
apiRouter.use("/prediction", predictionRoutes);

export default apiRouter