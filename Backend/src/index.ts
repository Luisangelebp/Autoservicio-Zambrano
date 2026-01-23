import express from "express";
import cors from "cors";
import morgan from "morgan";
import loginRouter from "./routes/loginRoute";
import registerRouter from "./routes/registerRoute";
import { authMiddleware } from "./middlewares/authMiddleware"
// Import route handlers

import adminRouter from "./routes/adminRoutes";
import mecanicoRouter from "./routes/mecanicoRoutes";
import clienteRouter from "./routes/clienteRoutes";
import citaRouter from "./routes/citaRoutes";
import pagoRouter from "./routes/pagoRoutes";
import itemsRouter from "./routes/itemsRoutes";
import carritoRouter from "./routes/carritoRoutes";

// --------------------------------

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// route login and register handlers here

app.use("/login", loginRouter);
app.use("/registro", registerRouter);

// Routes

app.use("/admin", authMiddleware, adminRouter);
app.use("/mecanicos", authMiddleware, mecanicoRouter);
app.use("/clientes", authMiddleware, clienteRouter);
app.use("/citas", authMiddleware, citaRouter);
app.use("/pagos", authMiddleware, pagoRouter);
app.use("/items", authMiddleware, itemsRouter);
app.use("/carrito", authMiddleware, carritoRouter);

app.use("/uploads", express.static("src/uploads"));

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});