import { Request, Response } from "express";
import { db } from "../database";
import { Mecanico } from "../models/mecanicoModel";

// Obtener todos los mecánicos
export async function getMecanicos(req: Request, res: Response) {
  try {
    const mecanicos: Mecanico[] = await db.all("SELECT * FROM mecanicos");
    return res.json(mecanicos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Obtener mecánico por ID
export async function getMecanicoById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const mecanico: Mecanico = await db.get("SELECT * FROM mecanicos WHERE id = ?", [id]);

    if (!mecanico) {
      return res.status(404).json({ message: "Mecánico no encontrado" });
    }

    return res.json(mecanico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Crear un nuevo mecánico
export async function createMecanico(req: Request, res: Response) {
  const { nombre, apellido, especialidad }: Mecanico = req.body;

  if (!nombre || !apellido || !especialidad) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  try {
    const result = await db.run(
      `INSERT INTO mecanicos (nombre, apellido, especialidad) VALUES (?, ?, ?)`,
      [nombre, apellido, especialidad]
    );

    const newMecanico: Mecanico = {
      id: result.lastID,
      nombre,
      apellido,
      especialidad
    };

    return res.status(201).json({
      message: "Mecánico creado exitosamente 🚀",
      mecanico: newMecanico
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Actualizar un mecánico existente
export async function updateMecanico(req: Request, res: Response) {
  const { id } = req.params;
  const { nombre, apellido, especialidad }: Mecanico = req.body;

  try {
    const result = await db.run(
      `UPDATE mecanicos SET nombre = ?, apellido = ?, especialidad = ? WHERE id = ?`,
      [nombre, apellido, especialidad, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "Mecánico no encontrado" });
    }

    return res.json({ message: "Mecánico actualizado exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}

// Eliminar un mecánico
export async function deleteMecanico(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const result = await db.run("DELETE FROM mecanicos WHERE id = ?", [id]);

    if (result.changes === 0) {
      return res.status(404).json({ message: "Mecánico no encontrado" });
    }

    return res.json({ message: "Mecánico eliminado exitosamente 🚀" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}