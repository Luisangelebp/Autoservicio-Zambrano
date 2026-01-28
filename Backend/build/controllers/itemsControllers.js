"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItems = getItems;
exports.getItemById = getItemById;
exports.createItem = createItem;
exports.updateItem = updateItem;
exports.deleteItem = deleteItem;
const database_1 = require("../database");
// Obtener todos los ítems
async function getItems(req, res) {
    try {
        const items = await database_1.db.all("SELECT * FROM items");
        return res.json(items);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Obtener ítem por ID
async function getItemById(req, res) {
    const { id } = req.params;
    try {
        const item = await database_1.db.get("SELECT * FROM items WHERE id = ?", [id]);
        if (!item) {
            return res.status(404).json({ message: "Ítem no encontrado" });
        }
        return res.json(item);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Crear ítem con foto
async function createItem(req, res) {
    const { nombre, descripcion, precio, cant } = req.body;
    const foto = req.file ? req.file.filename : undefined;
    if (!nombre || precio === undefined || cant === undefined || foto === undefined) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        const result = await database_1.db.run(`INSERT INTO items (nombre, descripcion, precio, cant, foto)
       VALUES (?, ?, ?, ?, ?)`, [nombre, descripcion || "", precio, cant, foto]);
        const newItem = {
            id: result.lastID,
            nombre,
            descripcion,
            precio,
            cant,
            foto,
        };
        return res.status(201).json({
            message: "Ítem creado exitosamente 🚀",
            item: newItem
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Actualizar ítem con foto opcional
async function updateItem(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, cant } = req.body;
    const foto = req.file ? req.file.filename : null;
    try {
        const result = await database_1.db.run(`UPDATE items
       SET nombre = ?, descripcion = ?, precio = ?, cant = ?, foto = ?
       WHERE id = ?`, [nombre, descripcion, precio, cant, foto, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Ítem no encontrado" });
        }
        return res.json({ message: "Ítem actualizado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Eliminar ítem
async function deleteItem(req, res) {
    const { id } = req.params;
    try {
        const result = await database_1.db.run("DELETE FROM items WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Ítem no encontrado" });
        }
        return res.json({ message: "Ítem eliminado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
