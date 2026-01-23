"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientes = getClientes;
exports.getClienteById = getClienteById;
exports.updateCliente = updateCliente;
exports.deleteCliente = deleteCliente;
const database_1 = require("../database");
// Obtener todos los clientes
async function getClientes(req, res) {
    try {
        const clientes = await database_1.db.all("SELECT * FROM clientes");
        return res.json(clientes);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Obtener cliente por ID
async function getClienteById(req, res) {
    const { id } = req.params;
    try {
        const cliente = await database_1.db.get("SELECT * FROM clientes WHERE id = ?", [id]);
        if (!cliente) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        return res.json(cliente);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Actualizar cliente
async function updateCliente(req, res) {
    const { id } = req.params;
    const { nombre, apellido, correo, pass, cedula, direccion, telefono } = req.body;
    if (!id) {
        return res.status(400).json({ message: "ID requerido" });
    }
    try {
        const result = await database_1.db.run(`UPDATE clientes
       SET nombre = ?, apellido = ?, correo = ?, pass = ?, cedula = ?, direccion = ?, telefono = ?
       WHERE id = ?`, [nombre, apellido, correo, pass, cedula, direccion, telefono, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        return res.json({ message: "Cliente actualizado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Eliminar cliente
async function deleteCliente(req, res) {
    const { id } = req.params;
    try {
        const result = await database_1.db.run("DELETE FROM clientes WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        return res.json({ message: "Cliente eliminado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
