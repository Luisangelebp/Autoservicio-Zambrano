"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmins = getAdmins;
exports.createAdmin = createAdmin;
exports.updateAdmin = updateAdmin;
exports.deleteAdmin = deleteAdmin;
const database_1 = require("../database");
// Get all admins
async function getAdmins(req, res) {
    try {
        const admins = await database_1.db.all("SELECT * FROM admins");
        return res.json(admins);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Crear un nuevo admin
async function createAdmin(req, res) {
    const { nombre, apellido, correo, pass, cedula } = req.body;
    if (!nombre || !apellido || !correo || !pass || !cedula) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const result = await database_1.db.run(`INSERT INTO admins (nombre, apellido, correo, pass, cedula)
       VALUES (?, ?, ?, ?, ?)`, [nombre, apellido, correo, pass, cedula]);
        const newAdmin = {
            id: result.lastID,
            nombre,
            apellido,
            correo,
            pass,
            cedula
        };
        return res.status(201).json({
            message: "Admin creado exitosamente 🚀",
            admin: newAdmin
        });
    }
    catch (error) {
        console.error(error);
        if (error.message.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ message: "El correo ya está registrado" });
        }
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Actualizar un admin existente
async function updateAdmin(req, res) {
    const { id } = req.params;
    const { nombre, apellido, correo, pass, cedula } = req.body;
    if (!id) {
        return res.status(400).json({ message: "ID requerido" });
    }
    try {
        const result = await database_1.db.run(`UPDATE admins
       SET nombre = ?, apellido = ?, correo = ?, pass = ?, cedula = ?
       WHERE id = ?`, [nombre, apellido, correo, pass, cedula, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Admin no encontrado" });
        }
        const updatedAdmin = {
            id: Number(id),
            nombre,
            apellido,
            correo,
            pass,
            cedula
        };
        return res.json({
            message: "Admin actualizado exitosamente 🚀",
            admin: updatedAdmin
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Eliminar un admin existente
async function deleteAdmin(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "ID requerido" });
    }
    try {
        const result = await database_1.db.run("DELETE FROM admins WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Admin no encontrado" });
        }
        return res.json({ message: "Admin eliminado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
