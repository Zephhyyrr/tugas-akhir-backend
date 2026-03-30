import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { networkInterfaces } from "node:os"
import apiRouter from "./routes/index.routes.js"
import morgan from "morgan"

dotenv.config()
const app = express()

app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
    origin: [process.env.FRONTEND_URL!, "http://localhost:3001"],
    credentials: true
}))

app.use("/api", apiRouter)

export default app