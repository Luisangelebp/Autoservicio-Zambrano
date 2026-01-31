import { Request, Response } from "express";
import { db } from "../database";
import { Pago } from "../models/pagoModel";

// Obtener todos los pagos
export async function getPagos(req: Request, res: Response) {
  try {
    const pagos: Pago[] = await db.all("SELECT * FROM pagos");
    return res.json(pagos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Obtener pago por ID
export async function getPagoById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const pago: Pago = await db.get("SELECT * FROM pagos WHERE id = ?", [id]);

    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    return res.json(pago);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Crear nuevo pago
export async function createPago(req: Request, res: Response) {
  const { metodoPago, clienteId, citaId, carritoId, fecha, confirmado, banco, referencia, monto }: Pago = req.body;

  if (!metodoPago || !clienteId || !fecha || monto === undefined) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }
  console.log(req.body);
  try {
    const result = await db.run(
      `INSERT INTO pagos (metodoPago, clienteId, citaId, carritoId, fecha, confirmado, banco, referencia, monto)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [metodoPago, clienteId, citaId || null, carritoId || null, fecha, confirmado ? 1 : 0, banco || null, referencia || null, monto]
    );

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
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Actualizar pago (PUT)
export async function updatePago(req: Request, res: Response) {
  const { id } = req.params;
  const { metodoPago, clienteId, citaId, carritoId, fecha, confirmado, banco, referencia, monto }: Pago = req.body;

  try {
    const result = await db.run(
      `UPDATE pagos
       SET metodoPago = ?, clienteId = ?, citaId = ?, carritoId = ?, fecha = ?, confirmado = ?, banco = ?, referencia = ?, monto = ?
       WHERE id = ?`,
      [metodoPago, clienteId, citaId, carritoId, fecha, confirmado ? 1 : 0, banco, referencia, monto, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    return res.json({ message: "Pago actualizado exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Eliminar pago
export async function deletePago(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await db.run("DELETE FROM pagos WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Pago no encontrado" });
    }

    return res.json({ message: "Pago eliminado exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}