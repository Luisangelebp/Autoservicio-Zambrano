"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagos = getPagos;
exports.getPagoById = getPagoById;
exports.createPago = createPago;
exports.updatePago = updatePago;
exports.deletePago = deletePago;
const database_1 = require("../database");
// Obtener todos los pagos
async function getPagos(req, res) {
    try {
        const pagos = await database_1.db.all("SELECT * FROM pagos");
        return res.json(pagos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Obtener pago por ID
async function getPagoById(req, res) {
    const { id } = req.params;
    try {
        const pago = await database_1.db.get("SELECT * FROM pagos WHERE id = ?", [id]);
        if (!pago) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }
        return res.json(pago);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Crear nuevo pago
async function createPago(req, res) {
    const { metodoPago, clienteId, citaId, carritoId, fecha, confirmado, banco, referencia, monto } = req.body;
    if (!metodoPago || !clienteId || !fecha || monto === undefined) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const result = await database_1.db.run(`INSERT INTO pagos (metodoPago, clienteId, citaId, carritoId, fecha, confirmado, banco, referencia, monto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [metodoPago, clienteId, citaId || null, carritoId || null, fecha, confirmado ? 1 : 0, banco || null, referencia || null, monto]);
        const newPago = {
            id: result.lastID,
            metodoPago,
            clienteId,
            citaId,
            carritoId,
            fecha,
            confirmado,
            banco,
            referencia,
            monto
        };
        return res.status(201).json({
            message: "Pago creado exitosamente 🚀",
            pago: newPago
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Actualizar pago (PUT)
async function updatePago(req, res) {
    const { id } = req.params;
    const { metodoPago, clienteId, citaId, carritoId, fecha, confirmado, banco, referencia, monto } = req.body;
    try {
        const result = await database_1.db.run(`UPDATE pagos
       SET metodoPago = ?, clienteId = ?, citaId = ?, carritoId = ?, fecha = ?, confirmado = ?, banco = ?, referencia = ?, monto = ?
       WHERE id = ?`, [metodoPago, clienteId, citaId, carritoId, fecha, confirmado ? 1 : 0, banco, referencia, monto, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }
        return res.json({ message: "Pago actualizado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Eliminar pago
async function deletePago(req, res) {
    const { id } = req.params;
    try {
        const result = await database_1.db.run("DELETE FROM pagos WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }
        return res.json({ message: "Pago eliminado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
