"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const router = (0, express_1.Router)();
// Login básico: compara usuario y contraseña con valores fijos
router.post("/", async (req, res) => {
    const { correo, pass, rol } = req.body;
    if (!correo || !pass || !rol) {
        return res.status(400).json({ message: "Correo, contraseña y rol requeridos" });
    }
    try {
        let user = null;
        if (rol === "clientes") {
            user = await database_1.db.get("SELECT * FROM clientes WHERE correo = ? AND pass = ?", [correo, pass]);
        }
        else if (rol === "admin") {
            user = await database_1.db.get("SELECT * FROM admins WHERE correo = ? AND pass = ?", [correo, pass]);
        }
        if (user) {
            return res.json({
                message: `Login exitoso (${rol})`,
                token: "12345",
                user,
                rol
            });
        }
        return res.status(401).json({ message: "Credenciales inválidas" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
});
exports.default = router;
