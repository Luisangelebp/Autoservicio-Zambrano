import { Request, Response } from "express";
import { db } from "../database";
import { Orden } from "../models/ordenModel";

// 1. GET: Obtener todas las órdenes
export async function getOrdenes(req: Request, res: Response) {
  try {
    const ordenes = await db.all("SELECT * FROM ordenes");

    for (const orden of ordenes) {
      const productos = await db.all(
        "SELECT itemId, cantidad, montoU FROM ordenes_productos WHERE ordenId = ?",
        [orden.id]
      );
      orden.productos = productos;
    }

    return res.json(ordenes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener órdenes" });
  }
}

// 2. GET BY CLIENT: Obtener todas las órdenes de un cliente específico
export async function getOrdenesByCliente(req: Request, res: Response) {
  const { clienteId } = req.params;
  try {
    const ordenes = await db.all("SELECT * FROM ordenes WHERE clienteId = ?", [clienteId]);

    for (const orden of ordenes) {
      const productos = await db.all(
        "SELECT itemId, cantidad, montoU FROM ordenes_productos WHERE ordenId = ?",
        [orden.id]
      );
      orden.productos = productos;
    }

    return res.json(ordenes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener órdenes del cliente" });
  }
}

// 3. POST: Crear orden y eliminar el carrito del cliente
export async function createOrden(req: Request, res: Response) {
  const { clienteId, productos }: Orden = req.body;

  if (!clienteId || !productos || productos.length === 0) {
    return res.status(400).json({ message: "Datos de orden incompletos" });
  }

  try {
    // Iniciar la creación de la orden
    const fechaActual = new Date().toISOString();
    const result = await db.run(
      "INSERT INTO ordenes (clienteId, fecha, entregado) VALUES (?, ?, ?)",
      [clienteId, fechaActual, false]
    );

    const ordenId = result.lastID;

    // Insertar el detalle de productos con el precio unitario (montoU)
    for (const p of productos) {
      await db.run(
        "INSERT INTO ordenes_productos (ordenId, itemId, cantidad, montoU) VALUES (?, ?, ?, ?)",
        [ordenId, p.itemId, p.cantidad, p.montoU]
      );
    }

    // LÓGICA AUTOMÁTICA: Eliminar el carrito del cliente
    // Primero buscamos el ID del carrito para limpiar la tabla intermedia
    const carrito = await db.get("SELECT id FROM carritos WHERE clienteId = ?", [clienteId]);
    
    if (carrito) {
      await db.run("DELETE FROM carrito_productos WHERE carritoId = ?", [carrito.id]);
      await db.run("DELETE FROM carritos WHERE id = ?", [carrito.id]);
    }

    return res.status(201).json({
      message: "Orden creada exitosamente y carrito eliminado 📦",
      ordenId
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al procesar la orden" });
  }
}

// 4. PATCH: Editar solo el estado de entregado
export async function updateEntregado(req: Request, res: Response) {
  const { id } = req.params;
  const { entregado } = req.body;

  if (typeof entregado !== "boolean") {
    return res.status(400).json({ message: "El campo entregado debe ser booleano" });
  }

  try {
    const result = await db.run(
      "UPDATE ordenes SET entregado = ? WHERE id = ?",
      [entregado, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.json({ message: "Estado de entrega actualizado ✅" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la orden" });
  }
}