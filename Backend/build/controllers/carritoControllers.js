"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarritos = getCarritos;
exports.getCarritoById = getCarritoById;
exports.createCarrito = createCarrito;
exports.updateCarrito = updateCarrito;
exports.deleteCarrito = deleteCarrito;
const database_1 = require("../database");
// Obtener todos los carritos con sus productos
async function getCarritos(req, res) {
    try {
        const carritos = await database_1.db.all("SELECT * FROM carritos");
        // Para cada carrito, traer productos asociados
        for (const carrito of carritos) {
            const productos = await database_1.db.all("SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?", [carrito.id]);
            carrito.productos = productos;
        }
        return res.json(carritos);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Obtener carrito por ID con sus productos
async function getCarritoById(req, res) {
    const { id } = req.params;
    try {
        const carrito = await database_1.db.get("SELECT * FROM carritos WHERE id = ?", [id]);
        if (!carrito) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const productos = await database_1.db.all("SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?", [id]);
        carrito.productos = productos;
        return res.json(carrito);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Crear nuevo carrito con productos y actualizar stock de items
async function createCarrito(req, res) {
    const { clienteId, productos } = req.body;
    if (!clienteId || !productos || productos.length === 0) {
        return res.status(400).json({ message: "Faltan campos obligatorios" });
    }
    try {
        // Verificar si el cliente ya tiene un carrito
        const existingCarrito = await database_1.db.get("SELECT id FROM carritos WHERE clienteId = ?", [clienteId]);
        if (existingCarrito) {
            return res
                .status(409)
                .json({ message: "El cliente ya tiene un carrito existente" });
        }
        const result = await database_1.db.run("INSERT INTO carritos (clienteId) VALUES (?)", [clienteId]);
        const carritoId = result.lastID;
        // Insertar productos en la tabla intermedia y actualizar stock
        for (const p of productos) {
            // Insertar relación carrito-producto
            await database_1.db.run("INSERT INTO carrito_productos (carritoId, itemId, cantidad) VALUES (?, ?, ?)", [carritoId, p.itemId, p.cantidad]);
            // Actualizar stock del item
            await database_1.db.run("UPDATE items SET cant = cant - ? WHERE id = ?", [p.cantidad, p.itemId]);
        }
        return res.status(201).json({
            message: "Carrito creado exitosamente 🚀",
            carrito: { id: carritoId, clienteId, productos }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Actualizar carrito y sus productos con stock
async function updateCarrito(req, res) {
    const { id } = req.params;
    const { clienteId, productos } = req.body;
    try {
        // Actualizar clienteId
        await database_1.db.run("UPDATE carritos SET clienteId = ? WHERE id = ?", [clienteId, id]);
        // Recuperar productos anteriores para devolver stock
        const productosPrevios = await database_1.db.all("SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?", [id]);
        for (const prev of productosPrevios) {
            await database_1.db.run("UPDATE items SET cant = cant + ? WHERE id = ?", [prev.cantidad, prev.itemId]);
        }
        // Eliminar productos anteriores
        await database_1.db.run("DELETE FROM carrito_productos WHERE carritoId = ?", [id]);
        // Insertar productos nuevos y descontar stock
        for (const p of productos) {
            await database_1.db.run("INSERT INTO carrito_productos (carritoId, itemId, cantidad) VALUES (?, ?, ?)", [id, p.itemId, p.cantidad]);
            await database_1.db.run("UPDATE items SET cant = cant - ? WHERE id = ?", [p.cantidad, p.itemId]);
        }
        return res.json({ message: "Carrito actualizado exitosamente 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
// Eliminar carrito y devolver stock
async function deleteCarrito(req, res) {
    const { id } = req.params;
    try {
        // Recuperar productos asociados
        const productos = await database_1.db.all("SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?", [id]);
        // Devolver stock
        for (const p of productos) {
            await database_1.db.run("UPDATE items SET cant = cant + ? WHERE id = ?", [p.cantidad, p.itemId]);
        }
        // Eliminar productos asociados
        await database_1.db.run("DELETE FROM carrito_productos WHERE carritoId = ?", [id]);
        // Eliminar carrito
        const result = await database_1.db.run("DELETE FROM carritos WHERE id = ?", [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        return res.json({ message: "Carrito eliminado y stock restaurado 🚀" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
