import { Request, Response } from "express";
import { db } from "../database";
import { Carrito } from "../models/carritoModel";

// Obtener todos los carritos con sus productos
export async function getCarritos(req: Request, res: Response) {
  try {
    const carritos = await db.all("SELECT * FROM carritos");

    // Para cada carrito, traer productos asociados
    for (const carrito of carritos) {
      const productos = await db.all(
        "SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?",
        [carrito.id]
      );
      carrito.productos = productos;
    }

    return res.json(carritos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Obtener carrito por ID con sus productos
export async function getCarritoById(req: Request, res: Response) {
  const { clienteId } = req.params;
  try {
    const carrito = await db.get("SELECT * FROM carritos WHERE clienteId = ?", [clienteId]);
    
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    const id = carrito.id;

    const productos = await db.all(
      "SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?",
      [id]
    );
    carrito.productos = productos;

    return res.json(carrito);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Crear nuevo carrito con productos y actualizar stock de items
export async function createCarrito(req: Request, res: Response) {
  const { clienteId, productos }: Carrito = req.body;

  if (!clienteId) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    // Verificar si el cliente ya tiene un carrito
    const existingCarrito = await db.get(
      "SELECT id FROM carritos WHERE clienteId = ?",
      [clienteId]
    );

    if (existingCarrito) {
      return res
        .status(409)
        .json({ message: "El cliente ya tiene un carrito existente" });
    }

    const result = await db.run(
      "INSERT INTO carritos (clienteId) VALUES (?)",
      [clienteId]
    );

    const carritoId = result.lastID;

    // Insertar productos en la tabla intermedia y actualizar stock
    // if (productos || productos.length > 0) {
    //   for (const p of productos) {
    //     // Insertar relación carrito-producto
    //     await db.run(
    //       "INSERT INTO carrito_productos (carritoId, itemId, cantidad) VALUES (?, ?, ?)",
    //       [carritoId, p.itemId, p.cantidad]
    //     );

    //     // Actualizar stock del item
    //     await db.run(
    //       "UPDATE items SET cant = cant - ? WHERE id = ?",
    //       [p.cantidad, p.itemId]
    //     );
    //   }
    // }
    return res.status(201).json({
      message: "Carrito creado exitosamente 🚀",
      carrito: { id: carritoId, clienteId, productos }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Actualizar carrito y sus productos con stock
export async function updateCarrito(req: Request, res: Response) {
  const { id } = req.params;
  const { clienteId, productos }: Carrito = req.body;

  try {

    // Actualizar clienteId
    await db.run("UPDATE carritos SET clienteId = ? WHERE id = ?", [clienteId, id]);

    // Recuperar productos anteriores para devolver stock
    const productosPrevios = await db.all(
      "SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?",
      [id]
    );

    for (const prev of productosPrevios) {
      await db.run(
        "UPDATE items SET cant = cant + ? WHERE id = ?",
        [prev.cantidad, prev.itemId]
      );
    }

    // Eliminar productos anteriores
    await db.run("DELETE FROM carrito_productos WHERE carritoId = ?", [id]);

    // Insertar productos nuevos y descontar stock
    for (const p of productos) {
      await db.run(
        "INSERT INTO carrito_productos (carritoId, itemId, cantidad) VALUES (?, ?, ?)",
        [id, p.itemId, p.cantidad]
      );

      await db.run(
        "UPDATE items SET cant = cant - ? WHERE id = ?",
        [p.cantidad, p.itemId]
      );
    }

    return res.json({ message: "Carrito actualizado exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Eliminar carrito y devolver stock
export async function deleteCarrito(req: Request, res: Response) {
  const { id } = req.params;

  try {

    // Recuperar productos asociados
    const productos = await db.all(
      "SELECT itemId, cantidad FROM carrito_productos WHERE carritoId = ?",
      [id]
    );

    // Devolver stock
    for (const p of productos) {
      await db.run(
        "UPDATE items SET cant = cant + ? WHERE id = ?",
        [p.cantidad, p.itemId]
      );
    }

    // Eliminar productos asociados
    await db.run("DELETE FROM carrito_productos WHERE carritoId = ?", [id]);

    // Eliminar carrito
    const result = await db.run("DELETE FROM carritos WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    return res.json({ message: "Carrito eliminado y stock restaurado 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}