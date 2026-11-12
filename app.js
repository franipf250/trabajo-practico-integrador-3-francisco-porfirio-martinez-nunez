import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { startDB } from "./src/config/database.js";
import { authRouter } from "./src/routes/auth.routes.js";
import { userRouter } from "./src/routes/user.routes.js";
import { eventRouter } from "./src/routes/event.routes.js";
import { categoryRouter } from "./src/routes/category.routes.js";

const app = express();
const PORT = process.env.PORT || 3331;

// Middlewares globales
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: true, // Ajusta según tus necesidades de CORS
  credentials: true // Necesario si usas cookies seguras con credenciales
}));

// Rutas de la API (prefijo /api)
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", eventRouter);
app.use("/api", categoryRouter);

// Inicializar base de datos y levantar servidor
app.listen(PORT, async () => {
  await startDB();
  console.log(`Servidor listo en el puerto ${PORT}`);
});