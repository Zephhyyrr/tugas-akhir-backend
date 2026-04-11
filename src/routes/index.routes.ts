import { Router } from "express";
const apiRouter = Router()
import userRoutes from "./user.routes";
import contentRoutes from "./content.routes";
import keteranganTransaksiRoutes from "./keterangan_transaksi.routes";
import transactionRoutes from "./transaction.routes";

apiRouter.use("/users", userRoutes);
apiRouter.use("/contents", contentRoutes);
apiRouter.use("/keterangan-transaksi", keteranganTransaksiRoutes);
apiRouter.use("/transactions", transactionRoutes);

export default apiRouter