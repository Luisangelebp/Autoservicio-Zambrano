"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCitas = getCitas;
exports.getCitaById = getCitaById;
exports.createCita = createCita;
exports.updateCita = updateCita;
exports.deleteCita = deleteCita;
exports.cambiarEstadoCita = cambiarEstadoCita;
exports.cambiarMontoCita = cambiarMontoCita;
const database_1 = require("../database");
// Obtener todas las citas
async function getCitas(req, res) {
    try {
        const citas = await database_1.db.all("SELECT * FROM citas");
        return res.json(citas);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Obtener cita por ID
async function getCitaById(req, res) {
    const { id } = req.params;
    try {
        const cita = await database_1.db.get("SELECT * FROM citas WHERE id = ?", [id]);
        if (!cita) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        return res.json(cita);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Crear nueva cita
async function createCita(req, res) {
    const { id_cliente, id_mecanico, fecha, descripcion, servicio, estado } = req.body;
    if (!id_cliente || !id_mecanico || !fecha || !servicio) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const result = await database_1.db.run(`INSERT INTO citas (id_cliente, id_mecanico, fecha, descripcion, servicio, estado, monto)
       VALUES (?, ?, ?, ?, ?, ?, 0)`, [id_cliente, id_mecanico, fecha, descripcion || "", servicio, estado || "pendiente"]);
        const newCita = {
            id: result.lastID,
            id_cliente,
            id_mecanico,
            fecha,
            descripcion,
            servicio,
            estado: estado || "pendiente",
            monto: 0,
        };
        return res.status(201).json({
            message: "Cita creada exitosamente 🚀",
            cita: newCita
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Actualizar cita
async function updateCita(req, res) {
    const { id } = req.params;
    const { id_cliente, id_mecanico, fecha, descripcion, servicio, estado, monto } = req.body;
    try {
        const result = await database_1.db.run(`UPDATE citas
       SET id_cliente = ?, id_mecanico = ?, fecha = ?, descripcion = ?, servicio = ?, estado = ?, monto = ?
       WHERE id = ?`, [id_cliente, id_mecanico, fecha, descripcion, servicio, estado, monto, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        return res.json({ message: "Cita actualizada exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Eliminar cita
async function deleteCita(req, res) {
    const { id } = req.params;
    try {
        const result = await database_1.db.run("DELETE FROM citas WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        return res.json({ message: "Cita eliminada exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Cambiar estado de cita y monto
async function cambiarEstadoCita(req, res) {
    const { id } = req.params;
    const { estado } = req.body;
    if (!estado) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const result = await database_1.db.run(`UPDATE citas
       SET estado = ?
       WHERE id = ?`, [estado, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        return res.json({ message: "Estado de cita actualizado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
async function cambiarMontoCita(req, res) {
    const { id } = req.params;
    const { monto } = req.body;
    if (!monto) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const result = await database_1.db.run(`UPDATE citas
       SET monto = ?
       WHERE id = ?`, [monto, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }
        return res.json({ message: "Monto de cita actualizado exitosamente 🚀" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
