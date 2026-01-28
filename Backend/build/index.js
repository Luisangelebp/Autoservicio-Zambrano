"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const loginRoute_1 = __importDefault(require("./routes/loginRoute"));
const registerRoute_1 = __importDefault(require("./routes/registerRoute"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
// Import route handlers
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const mecanicoRoutes_1 = __importDefault(require("./routes/mecanicoRoutes"));
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
const citaRoutes_1 = __importDefault(require("./routes/citaRoutes"));
const pagoRoutes_1 = __importDefault(require("./routes/pagoRoutes"));
const itemsRoutes_1 = __importDefault(require("./routes/itemsRoutes"));
const carritoRoutes_1 = __importDefault(require("./routes/carritoRoutes"));
// --------------------------------
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
// route login and register handlers here
app.use("/login", loginRoute_1.default);
app.use("/registro", registerRoute_1.default);
// Routes
app.use("/admin", authMiddleware_1.authMiddleware, adminRoutes_1.default);
app.use("/mecanicos", authMiddleware_1.authMiddleware, mecanicoRoutes_1.default);
app.use("/clientes", authMiddleware_1.authMiddleware, clienteRoutes_1.default);
app.use("/citas", authMiddleware_1.authMiddleware, citaRoutes_1.default);
app.use("/pagos", authMiddleware_1.authMiddleware, pagoRoutes_1.default);
app.use("/items", authMiddleware_1.authMiddleware, itemsRoutes_1.default);
app.use("/carrito", authMiddleware_1.authMiddleware, carritoRoutes_1.default);
app.use("/uploads", express_1.default.static("src/uploads"));
app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
