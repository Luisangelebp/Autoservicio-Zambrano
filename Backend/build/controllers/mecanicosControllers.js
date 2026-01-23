"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMecanicos = getMecanicos;
exports.getMecanicoById = getMecanicoById;
exports.createMecanico = createMecanico;
exports.updateMecanico = updateMecanico;
exports.deleteMecanico = deleteMecanico;
const database_1 = require("../database");
// Obtener todos los mecánicos
async function getMecanicos(req, res) {
    try {
        const mecanicos = await database_1.db.all("SELECT * FROM mecanicos");
        return res.json(mecanicos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Obtener mecánico por ID
async function getMecanicoById(req, res) {
    const { id } = req.params;
    try {
        const mecanico = await database_1.db.get("SELECT * FROM mecanicos WHERE id = ?", [id]);
        if (!mecanico) {
            return res.status(404).json({ message: "Mecánico no encontrado" });
        }
        return res.json(mecanico);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Crear un nuevo mecánico
async function createMecanico(req, res) {
    const { nombre, apellido, especialidad } = req.body;
    if (!nombre || !apellido || !especialidad) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const result = await database_1.db.run(`INSERT INTO mecanicos (nombre, apellido, especialidad) VALUES (?, ?, ?)`, [nombre, apellido, especialidad]);
        const newMecanico = {
            id: result.lastID,
            nombre,
            apellido,
            especialidad
        };
        return res.status(201).json({
            message: "Mecánico creado exitosamente 🚀",
            mecanico: newMecanico
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Actualizar un mecánico existente
async function updateMecanico(req, res) {
    const { id } = req.params;
    const { nombre, apellido, especialidad } = req.body;
    try {
        const result = await database_1.db.run(`UPDATE mecanicos SET nombre = ?, apellido = ?, especialidad = ? WHERE id = ?`, [nombre, apellido, especialidad, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Mecánico no encontrado" });
        }
        return res.json({ message: "Mecánico actualizado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Eliminar un mecánico
async function deleteMecanico(req, res) {
    const { id } = req.params;
    try {
        const result = await database_1.db.run("DELETE FROM mecanicos WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Mecánico no encontrado" });
        }
        return res.json({ message: "Mecánico eliminado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
