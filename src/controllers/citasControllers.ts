import { Request, Response } from "express";
import { db } from "../database";
import { Cita } from "../models/citaModel";

// Obtener todas las citas
export async function getCitas(req: Request, res: Response) {
  try {
    const citas: Cita[] = await db.all("SELECT * FROM citas");
    return res.json(citas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Obtener cita por ID
export async function getCitaById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const cita: Cita = await db.get("SELECT * FROM citas WHERE id = ?", [id]);

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    return res.json(cita);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Crear nueva cita
export async function createCita(req: Request, res: Response) {
  const { id_cliente, id_mecanico, fecha, descripcion, servicio, estado }: Cita = req.body;

  if (!id_cliente || !id_mecanico || !fecha || !servicio) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const result = await db.run(
      `INSERT INTO citas (id_cliente, id_mecanico, fecha, descripcion, servicio, estado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_cliente, id_mecanico, fecha, descripcion || "", servicio, estado || "pendiente"]
    );

    const newCita: Cita = {
      id: result.lastID,
      id_cliente,
      id_mecanico,
      fecha,
      descripcion,
      servicio,
      estado: estado || "pendiente"
    };

    return res.status(201).json({
      message: "Cita creada exitosamente 🚀",
      cita: newCita
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Actualizar cita
export async function updateCita(req: Request, res: Response) {
  const { id } = req.params;
  const { id_cliente, id_mecanico, fecha, descripcion, servicio, estado }: Cita = req.body;

  try {
    const result = await db.run(
      `UPDATE citas
       SET id_cliente = ?, id_mecanico = ?, fecha = ?, descripcion = ?, servicio = ?, estado = ?
       WHERE id = ?`,
      [id_cliente, id_mecanico, fecha, descripcion, servicio, estado, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    return res.json({ message: "Cita actualizada exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Eliminar cita
export async function deleteCita(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await db.run("DELETE FROM citas WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    return res.json({ message: "Cita eliminada exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}